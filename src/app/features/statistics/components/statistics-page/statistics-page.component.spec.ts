import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {environment} from '@environment';
import {StatisticsResponse} from '../../api/dto/statistics-response';
import {StatisticsPageComponent} from './statistics-page.component';

describe('StatisticsPageComponent', () => {
  it('shows the requested metrics and reloads after an error', async () => {
    TestBed.configureTestingModule({
      imports: [StatisticsPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(StatisticsPageComponent);
    const http = TestBed.inject(HttpTestingController);
    const url = `${environment.apiUrl}/statistics`;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading statistics');
    http.expectOne(url).flush(null, {status: 503, statusText: 'Service Unavailable'});
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=alert]')).toBeTruthy();

    fixture.nativeElement.querySelector('button').click();
    TestBed.tick();
    const data: StatisticsResponse = {
      measuredAt: '2026-11-24T12:00:00Z',
      images: [{type: 'igdb-screenshot', source: 10, cached: 10, pending: 0}],
      catalog: {
        associatedSuites: 3, unassociatedSuites: 2, gamesWithCover: 3, gamesWithBackground: 2,
        gamesWithoutBackground: 1, gamesWithScreenshots: 3, players: 4, trophies: 20,
      },
      history: [{sampledAt: '2026-11-24T11:45:00Z', type: 'igdb-screenshot', pending: 7}],
    };
    http.expectOne(url).flush(data);
    await fixture.whenStable();
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('0 images pending');
    expect(content).toContain('Suites without a game');
    expect(content).toContain('Games without a background');
    expect(content).toContain('7 pending');
    http.verify();
  });
});
