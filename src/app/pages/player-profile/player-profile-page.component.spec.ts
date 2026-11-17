import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {environment} from '@environment';
import {BackgroundService} from '@core/background/background.service';
import {PlayerProfilePageComponent} from './player-profile-page.component';
import {PlayerProfileStoreService} from './api/player-profile-store.service';
import {PlayerSummaryResponse} from './models/player-summary-response';
import {PlayerSuiteItem} from './models/player-suite-item';
import {PlayerTrophyItem} from './models/player-trophy-item';

const summary: PlayerSummaryResponse = {
  playerId: 'player-1', pseudo: 'Lofrings', avatarUrl: null, nbPlayedSuites: 11,
  nbEarnedBronzeTrophies: 2, nbEarnedSilverTrophies: 3,
  nbEarnedGoldTrophies: 4, nbEarnedPlatinumTrophies: 1,
};
const suite = (id: number): PlayerSuiteItem => ({
  suiteId: `suite-${id}`, gameId: 1001, title: `Suite ${id}`, platforms: ['PS5'], imageUrl: null,
  nbBronzeTrophies: 10, nbSilverTrophies: 5, nbGoldTrophies: 2, nbPlatinumTrophies: 1,
  nbEarnedBronzeTrophies: 2, nbEarnedSilverTrophies: 1,
  nbEarnedGoldTrophies: 0, nbEarnedPlatinumTrophies: 0, lastPlayedAt: '2026-11-10T12:00:00Z',
});
const trophy = (id: number): PlayerTrophyItem => ({
  trophyId: `trophy-${id}`, suiteId: 'suite-0', gameId: 1001, suiteTitle: 'Suite 0',
  rank: id, title: `Trophy ${id}`, description: 'An earned trophy', color: 'bronze',
  iconUrl: null, earnedAt: '2026-11-10T12:00:00Z',
});

describe('PlayerProfilePageComponent', () => {
  let fixture: ComponentFixture<PlayerProfilePageComponent>;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/player/profile`;

  const render = async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();
    TestBed.tick();
  };
  const listRequest = (player: string, list: string, page: number) => http.expectOne(request =>
    request.url === `${baseUrl}/${player}/${list}` && request.params.get('page') === `${page}`
      && request.params.get('size') === '10');
  const button = (list: string): HTMLButtonElement | null => fixture.nativeElement.querySelector(
    `button[aria-label="Load more ${list}"]`);

  async function initialLoad(suiteTotal = 11, trophyTotal = 11) {
    fixture.componentRef.setInput('playerId', 'player-1');
    await render();
    http.expectOne(`${baseUrl}/player-1`).flush(summary);
    http.expectOne(`${baseUrl}/player-1/background`).flush({url: 'player-1-background.png'});
    listRequest('player-1', 'suites', 0).flush({content: suiteTotal ? Array.from({length: 10}, (_, i) => suite(i)) : [], total: suiteTotal, page: 0, size: 10});
    listRequest('player-1', 'trophies', 0).flush({content: trophyTotal ? Array.from({length: 10}, (_, i) => trophy(i)) : [], total: trophyTotal, page: 0, size: 10});
    await render();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerProfilePageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PlayerProfilePageComponent);
  });

  afterEach(() => http.verify());

  it('loads the summary and both first pages, with a fallback avatar', async () => {
    await initialLoad();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Lofrings');
    expect(fixture.nativeElement.querySelector('.player-avatar').getAttribute('src')).toBe('/assets/icons/user.svg');
    expect(fixture.nativeElement.querySelectorAll('tq-player-suite-card')).toHaveLength(10);
    expect(fixture.nativeElement.querySelectorAll('tq-player-trophy-card')).toHaveLength(10);
    expect(button('suites')).not.toBeNull();
    expect(button('trophies')).not.toBeNull();
    expect(TestBed.inject(BackgroundService).image()).toEqual({url: 'player-1-background.png'});
  });

  it('appends suites independently and prevents duplicate requests while loading', async () => {
    await initialLoad();
    button('suites')!.click();
    await render();
    expect(button('suites')!.disabled).toBe(true);
    fixture.componentInstance.suites.loadMore();
    listRequest('player-1', 'suites', 1).flush({content: [suite(10)], total: 11, page: 1, size: 10});
    await render();
    expect(fixture.componentInstance.suites.items().map(item => item.suiteId)).toEqual(Array.from({length: 11}, (_, i) => `suite-${i}`));
    expect(button('suites')).toBeNull();
    expect(fixture.componentInstance.trophies.items()).toHaveLength(10);
    expect(button('trophies')).not.toBeNull();
  });

  it('appends trophies in server order and hides load more after the final page', async () => {
    await initialLoad();
    button('trophies')!.click();
    await render();
    listRequest('player-1', 'trophies', 1).flush({content: [trophy(10)], total: 11, page: 1, size: 10});
    await render();
    expect(fixture.componentInstance.trophies.items().map(item => item.trophyId)).toEqual(Array.from({length: 11}, (_, i) => `trophy-${i}`));
    expect(button('trophies')).toBeNull();
    expect(button('suites')).not.toBeNull();
  });

  it('retains loaded items after an error and retries the same page', async () => {
    await initialLoad();
    button('suites')!.click();
    await render();
    listRequest('player-1', 'suites', 1).flush('Unavailable', {status: 503, statusText: 'Unavailable'});
    await render();
    expect(fixture.componentInstance.suites.items()).toHaveLength(10);
    expect(button('suites')!.textContent).toContain('Retry');
    button('suites')!.click();
    await render();
    listRequest('player-1', 'suites', 1).flush({content: [suite(10)], total: 11, page: 1, size: 10});
    await render();
    expect(fixture.componentInstance.suites.items()).toHaveLength(11);
    expect(fixture.nativeElement.querySelectorAll('.profile-error')).toHaveLength(0);
  });

  it('shows empty states without load more buttons', async () => {
    await initialLoad(0, 0);
    expect(fixture.nativeElement.textContent).toContain('No played suites yet.');
    expect(fixture.nativeElement.textContent).toContain('No earned trophies yet.');
    expect(button('suites')).toBeNull();
    expect(button('trophies')).toBeNull();
  });

  it('clears pagination when navigating to another player and cancels pending requests', async () => {
    await initialLoad();
    button('suites')!.click();
    await render();
    const oldRequest = listRequest('player-1', 'suites', 1);
    fixture.componentRef.setInput('playerId', 'player-2');
    await render();
    expect(oldRequest.cancelled).toBe(true);
    expect(TestBed.inject(BackgroundService).image()).toEqual({url: ''});
    expect(fixture.componentInstance.suites.items()).toEqual([]);
    expect(fixture.componentInstance.trophies.items()).toEqual([]);
    http.expectOne(`${baseUrl}/player-2/background`).flush({url: 'player-2-background.png'});
    http.expectOne(`${baseUrl}/player-2`).flush({...summary, playerId: 'player-2', pseudo: 'Another player'});
    listRequest('player-2', 'suites', 0).flush({content: [suite(20)], total: 1, page: 0, size: 10});
    listRequest('player-2', 'trophies', 0).flush({content: [], total: 0, page: 0, size: 10});
    await render();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Another player');
    expect(TestBed.inject(BackgroundService).image()).toEqual({url: 'player-2-background.png'});
    expect(fixture.componentInstance.suites.items().map(item => item.suiteId)).toEqual(['suite-20']);
    expect(button('suites')).toBeNull();
  });

  it('shows a not found message for an unknown player', async () => {
    fixture.componentRef.setInput('playerId', 'missing');
    await render();
    http.expectOne(`${baseUrl}/missing/background`).flush('Missing', {status: 404, statusText: 'Not Found'});
    http.expectOne(`${baseUrl}/missing`).flush('Missing', {status: 404, statusText: 'Not Found'});
    listRequest('missing', 'suites', 0).flush('Missing', {status: 404, statusText: 'Not Found'});
    listRequest('missing', 'trophies', 0).flush('Missing', {status: 404, statusText: 'Not Found'});
    await render();
    expect(fixture.nativeElement.textContent).toContain('Player not found.');
    expect(fixture.nativeElement.querySelectorAll('.profile-section')).toHaveLength(0);
  });
  it('clears the background if the latest game has no image or the request fails', async () => {
    await initialLoad();
    const background = TestBed.inject(BackgroundService);
    expect(background.image().url).toBe('player-1-background.png');

    // A refresh can return no image; an old background must not remain visible.
    const store = fixture.debugElement.injector.get(PlayerProfileStoreService);
    store.background.reload();
    await render();
    http.expectOne(`${baseUrl}/player-1/background`).flush({url: ''});
    await render();
    expect(background.image()).toEqual({url: ''});

    background.setBackground({url: 'previous-page.png'});
    store.background.reload();
    await render();
    http.expectOne(`${baseUrl}/player-1/background`).flush('Unavailable', {status: 503, statusText: 'Unavailable'});
    await render();
    expect(background.image()).toEqual({url: ''});
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Lofrings');
  });

});
