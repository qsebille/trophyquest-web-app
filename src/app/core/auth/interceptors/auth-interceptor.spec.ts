import {TestBed} from '@angular/core/testing';
import {HttpClient, provideHttpClient, withInterceptors, withXhr} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {authInterceptor} from './auth-interceptor';
import {AuthService} from '../services/auth.service';
import {environment} from '@environment';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const getAccessToken = vi.fn<AuthService['getAccessToken']>();

  beforeEach(() => {
    getAccessToken.mockReset().mockReturnValue('mock-token');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {provide: AuthService, useValue: {getAccessToken}}
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add an Authorization header when authenticated and calling API', () => {
    httpClient.get(`${environment.apiUrl}/test`).subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
  });

  it('should NOT add an Authorization header when NOT authenticated (no token)', () => {
    getAccessToken.mockReturnValue(null);

    httpClient.get(`${environment.apiUrl}/test`).subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('waits for renewal before sending two API requests', async () => {
    let finishRenewal!: (token: string) => void;
    getAccessToken.mockReturnValue(new Promise<string>(resolve => { finishRenewal = resolve; }));
    const urls = ['first', 'second'].map(path => `${environment.apiUrl}/${path}`);
    urls.forEach(url => httpClient.get(url).subscribe());
    urls.forEach(url => httpTestingController.expectNone(url));

    finishRenewal('renewed-token');
    await Promise.resolve();

    urls.forEach(url => {
      const request = httpTestingController.expectOne(url);
      expect(request.request.headers.get('Authorization')).toBe('Bearer renewed-token');
      request.flush({});
    });
  });

  it('should NOT add an Authorization header when not calling API', () => {
    httpClient.get('https://other-api.com/test').subscribe();

    const req = httpTestingController.expectOne('https://other-api.com/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(getAccessToken).not.toHaveBeenCalled();
  });
});
