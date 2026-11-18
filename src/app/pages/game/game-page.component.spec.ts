import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {environment} from '@environment';
import {routes} from '../../app.routes';
import {GamePageComponent} from './game-page.component';

describe('GamePageComponent', () => {
  it('renders the presentation, suite links and recent players together with a fixed player limit', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes, withComponentInputBinding())],
    });
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    const base = `${environment.apiUrl}/game/details/1001`;

    async function render() {
      await new Promise(resolve => setTimeout(resolve, 0));
      harness.detectChanges();
      TestBed.tick();
    }

    await harness.navigateByUrl('/game/1001', GamePageComponent);
    await render();
    http.expectOne(base).flush({
      title: 'Tomb Raider', summary: 'Game overview', coverUrl: '/assets/icons/missing-game-image.svg',
      genres: ['Adventure'], themes: [], screenshotUrls: [],
    });
    http.expectOne(`${base}/background`).flush({url: null});
    http.expectOne(`${base}/suites`).flush([
      {suiteId: 'suite-1', title: 'Tomb Raider I', imageUrl: null, platforms: ['PS5']},
      {suiteId: 'suite-2', title: 'Tomb Raider II', imageUrl: null, platforms: ['PS4']},
    ]);
    http.expectOne(`${base}/players?size=10`).flush([
      {playerId: 'player-1', pseudo: 'Lofrings'},
    ]);
    await render();

    const page = harness.routeNativeElement!;
    expect(page.textContent).toContain('Game overview');
    expect(Array.from(page.querySelectorAll('tq-suite-card a'), link => link.getAttribute('href')))
      .toEqual(['/suite/suite-1', '/suite/suite-2']);
    expect(page.querySelector('tq-player-card a')?.getAttribute('href')).toBe('/player/player-1');
    expect(page.querySelector('[role=tablist]')).toBeNull();

    expect(page.querySelector('ngb-pagination')).toBeNull();
    http.verify();
  });
});
