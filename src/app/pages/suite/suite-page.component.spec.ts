import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {provideRouter, Router, withComponentInputBinding} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {BackgroundService, DEFAULT_BACKGROUND_URL} from '@core/background/background.service';
import {environment} from '@environment';
import {routes} from '../../app.routes';
import {SuiteDetails} from './models/suite-details';
import {SuitePageComponent} from './suite-page.component';

const suite: SuiteDetails = {
  suiteId: 'suite-1', gameId: 1001, title: 'Tomb Raider I', platforms: ['PS5'], imageUrl: null,
  nbBronzeTrophies: 1, nbSilverTrophies: 0, nbGoldTrophies: 0, nbPlatinumTrophies: 1,
};

const earnedTrophy = {
  trophyId: 'trophy-1', rank: 1, title: 'Finished Peru', description: 'Finish the Peru levels',
  color: 'bronze', groupName: 'Main game', iconUrl: null, isHidden: false,
  earnedAt: '2026-11-10T12:00:00Z',
};
const hiddenTrophy = {
  ...earnedTrophy, trophyId: 'trophy-2', rank: 2, title: 'Secret level', isHidden: true, earnedAt: null,
};
const player = {playerId: 'player-1', pseudo: 'Lofrings', avatarUrl: null, lastPlayedAt: null};

describe('SuitePageComponent', () => {
  const api = environment.apiUrl;
  const suiteUrl = `${api}/suite/suite-1`;
  let harness: RouterTestingHarness;
  let http: HttpTestingController;

  async function render() {
    await new Promise(resolve => setTimeout(resolve, 0));
    harness.detectChanges();
    TestBed.tick();
  }

  function clickLink(label: string) {
    const links = harness.routeNativeElement!.querySelectorAll<HTMLAnchorElement>('a');
    const link = Array.from(links).find(item => item.textContent.trim() === label);
    expect(link).toBeDefined();
    link!.click();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes, withComponentInputBinding())],
    });
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => http.verify());

  it('opens the trophies by default and links to the associated game by name', async () => {
    await harness.navigateByUrl('/suite/suite-1', SuitePageComponent);
    await render();
    http.expectOne(suiteUrl).flush(suite);
    http.expectOne(`${suiteUrl}/background`).flush({url: 'collection-background.png'});
    await render();
    http.expectOne(`${api}/game/details/1001`).flush({title: 'Tomb Raider Collection'});
    http.expectOne(`${suiteUrl}/trophies`).flush([]);
    await render();

    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toBe(suite.title);
    const link = harness.routeNativeElement!.querySelector('.suite-header a');
    expect(link?.getAttribute('href')).toBe('/game/1001');
    expect(link?.textContent).toBe('Tomb Raider Collection');
    expect(harness.routeNativeElement!.textContent).toContain('No trophies yet.');
  });

  it('paginates players and keeps the selected player in the trophy tab URL', async () => {
    await harness.navigateByUrl('/suite/suite-1?tab=players', SuitePageComponent);
    await render();
    http.expectOne(suiteUrl).flush({...suite, gameId: null});
    http.expectOne(`${suiteUrl}/background`).flush({url: null});
    await render();
    http.expectOne(`${suiteUrl}/players?page=0&size=10`).flush({content: [player], page: 0, size: 10, total: 11});
    await render();
    expect(harness.routeNativeElement!.querySelector('.suite-header a')).toBeNull();

    clickLink('Next');
    await render();
    http.expectOne(`${suiteUrl}/players?page=1&size=10`).flush({content: [player], page: 1, size: 10, total: 11});
    await render();

    clickLink('View trophies');
    await render();
    http.expectOne(`${api}/player/profile/player-1`).flush(player);
    http.expectOne(`${suiteUrl}/trophies?playerId=player-1`).flush([hiddenTrophy, earnedTrophy]);
    await render();

    expect(TestBed.inject(Router).url).toContain('playerId=player-1');
    const page = harness.routeNativeElement!;
    expect(page.querySelector('.suite-player-selection a')?.textContent).toBe('Lofrings');

    const filter = page.querySelector('select')!;
    filter.value = 'unearned';
    filter.dispatchEvent(new Event('change'));
    await render();
    expect(page.textContent).not.toContain('Finished Peru');
    expect(page.textContent).toContain('Hidden trophy');

    page.querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
    await render();
    expect(page.textContent).toContain('Secret level');

    clickLink('Clear selection');
    await render();
    http.expectOne(`${suiteUrl}/trophies`).flush([]);
    await render();
    expect(page.querySelector('select')).toBeNull();
  });

  it('shows an error for a missing suite without opening its tabs', async () => {
    await harness.navigateByUrl('/suite/suite-1', SuitePageComponent);
    await render();
    http.expectOne(suiteUrl).flush(null, {status: 404, statusText: 'Not Found'});
    http.expectOne(`${suiteUrl}/background`).flush(null, {status: 404, statusText: 'Not Found'});
    await render();

    expect(harness.routeNativeElement!.querySelector('[role=alert]')?.textContent).toContain('Suite not found.');
    expect(harness.routeNativeElement!.querySelector('.suite-tabs')).toBeNull();
    expect(TestBed.inject(BackgroundService).image().url).toBe(DEFAULT_BACKGROUND_URL);
  });

  it('updates the background on navigation and restores the default for a suite without an image', async () => {
    const background = TestBed.inject(BackgroundService);
    background.setBackground({url: 'previous-background.png'});

    await harness.navigateByUrl('/suite/suite-1', SuitePageComponent);
    await render();
    expect(background.image().url).toBe(DEFAULT_BACKGROUND_URL);
    http.expectOne(suiteUrl).flush(suite);
    http.expectOne(`${suiteUrl}/background`).flush({url: 'collection-background.png'});
    await render();
    http.expectOne(`${api}/game/details/1001`).flush({title: 'Tomb Raider Collection'});
    http.expectOne(`${suiteUrl}/trophies`).flush([]);
    expect(background.image().url).toBe('collection-background.png');

    const nextSuiteUrl = `${api}/suite/suite-2`;
    await harness.navigateByUrl('/suite/suite-2', SuitePageComponent);
    await render();
    expect(background.image().url).toBe(DEFAULT_BACKGROUND_URL);
    http.expectOne(nextSuiteUrl).flush({...suite, suiteId: 'suite-2', gameId: null});
    http.expectOne(`${nextSuiteUrl}/background`).flush({url: null});
    await render();
    http.expectOne(`${nextSuiteUrl}/trophies`).flush([]);
    expect(background.image().url).toBe(DEFAULT_BACKGROUND_URL);
  });
});
