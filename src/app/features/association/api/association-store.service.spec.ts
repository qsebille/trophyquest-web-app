import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {NotificationService} from '@core/notification/notification.service';
import {environment} from '@environment';
import {AssociationStoreService} from './association-store.service';

describe('AssociationStoreService', () => {
  const url = `${environment.apiUrl}/association`;
  let store: AssociationStoreService;
  let http: HttpTestingController;

  async function loadPage(page: number): Promise<void> {
    TestBed.tick();
    http.expectOne({method: 'GET', url: `${url}?page=${page}`}).flush({
      page,
      total: 2,
      size: 1,
      content: [{suite: {suiteId: `suite-${page}`}, games: [{gameId: 42}]}],
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    TestBed.tick();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    store = TestBed.inject(AssociationStoreService);
    await loadPage(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    http.verify();
  });

  it('validates the selected candidate and returns to the first page', async () => {
    store.selectCandidate(42);
    store.nextPage();
    await loadPage(1);
    expect(store.selectedGameId()).toBeNull();

    vi.useFakeTimers();
    store.selectCandidate(42);
    store.validateAssociation();
    store.validateAssociation();
    expect(store.isLoadingValidation()).toBe(true);

    const request = http.expectOne({method: 'POST', url: `${url}/validate`});
    expect(request.request.body).toEqual({suiteId: 'suite-1', gameId: 42});
    request.flush(true);
    await vi.advanceTimersByTimeAsync(1000);
    vi.useRealTimers();

    expect(store.isLoadingValidation()).toBe(false);
    await loadPage(0);
    expect(store.selectedGameId()).toBeNull();
  });

  it('reloads the first page after rejecting all candidates', async () => {
    vi.useFakeTimers();
    store.rejectAllCandidates();
    const request = http.expectOne({method: 'POST', url: `${url}/reject`});
    expect(request.request.body).toEqual({suiteId: 'suite-0'});
    request.flush(true);
    await vi.advanceTimersByTimeAsync(1000);
    vi.useRealTimers();

    expect(store.isLoadingValidation()).toBe(false);
    await loadPage(0);
  });

  it.each(['http', 'server result'])('clears the pending state after a failed submission (%s)', async failure => {
    vi.useFakeTimers();
    store.rejectAllCandidates();
    const request = http.expectOne({method: 'POST', url: `${url}/reject`});
    if (failure === 'http') {
      request.flush(null, {status: 503, statusText: 'Unavailable'});
    } else {
      request.flush(false);
    }
    await vi.advanceTimersByTimeAsync(1000);
    TestBed.tick();

    expect(store.isLoadingValidation()).toBe(false);
    http.expectNone({method: 'GET', url: `${url}?page=0`});
    expect(TestBed.inject(NotificationService).notifications[0]?.text).toBe('Failed to reject all candidates');
  });
});
