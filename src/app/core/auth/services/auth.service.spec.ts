import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ApplicationRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {environment} from '@environment';
import {firstValueFrom} from 'rxjs';
import {authInterceptor} from '../interceptors/auth-interceptor';
import {AuthService} from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.removeItem('auth_state');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    sessionStorage.removeItem('auth_state');
  });

  it('should be created', () => {
    expect(TestBed.inject(AuthService)).toBeTruthy();
  });

  it('loads the profile only for an authenticated session and retries after an error', async () => {
    service = TestBed.inject(AuthService);
    const http = TestBed.inject(HttpTestingController);
    const app = TestBed.inject(ApplicationRef);
    const profileUrl = `${environment.apiUrl}/auth/me`;
    TestBed.tick();
    http.expectNone(profileUrl);

    service.authState.set({accessToken: 'access', idToken: 'id', expiresAt: Date.now() + 60_000});
    TestBed.tick();
    http.expectOne(profileUrl).flush(null, {status: 503, statusText: 'Service Unavailable'});
    await app.whenStable();
    expect(service.profileLoadFailed()).toBe(true);
    expect(service.currentUser()).toBeNull();

    service.refreshCurrentUser();
    TestBed.tick();
    const user = {id: 'test-user', email: 'camille@example.test', displayName: 'Camille'};
    http.expectOne(profileUrl).flush(user);
    await app.whenStable();
    expect(service.profileLoadFailed()).toBe(false);
    expect(service.currentUser()).toEqual(user);

    service.authState.set(null);
    TestBed.tick();
    expect(service.currentUser()).toBeNull();
    http.verify();
  });

  const expiredSession = {
    accessToken: 'expired',
    idToken: 'id',
    refreshToken: 'refresh',
    expiresAt: 0,
  };
  const tokenUrl = `${environment.cognito.domain}/oauth2/token`;
  const newTokens = {
    access_token: 'renewed',
    id_token: 'new-id',
    expires_in: 3600,
    token_type: 'Bearer',
  };

  function restoreExpiredSession(): AuthService {
    sessionStorage.setItem('auth_state', JSON.stringify(expiredSession));
    return TestBed.inject(AuthService);
  }

  it('restores an expired session and shares one renewal between the profile and API reads', async () => {
    service = restoreExpiredSession();
    const http = TestBed.inject(HttpTestingController);
    const client = TestBed.inject(HttpClient);
    const apiUrl = `${environment.apiUrl}/home/top-games`;
    const profileUrl = `${environment.apiUrl}/auth/me`;
    const response = firstValueFrom(client.get(apiUrl));
    TestBed.tick();
    http.expectNone(apiUrl);
    http.expectNone(profileUrl);

    const renewal = http.expectOne({method: 'POST', url: tokenUrl});
    const body = new URLSearchParams(renewal.request.body);
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('client_id')).toBe(environment.cognito.clientId);
    expect(body.get('refresh_token')).toBe('refresh');
    expect(renewal.request.headers.has('Authorization')).toBe(false);
    renewal.flush(newTokens);

    await new Promise(resolve => setTimeout(resolve, 0));
    for (const url of [apiUrl, profileUrl]) {
      const request = http.expectOne(url);
      expect(request.request.headers.get('Authorization')).toBe('Bearer renewed');
      request.flush(url === apiUrl ? [] : {id: 'player'});
    }
    expect(await response).toEqual([]);
    expect(JSON.parse(sessionStorage.getItem('auth_state')!)).toMatchObject({
      accessToken: 'renewed',
      idToken: 'new-id',
      refreshToken: 'refresh',
    });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('keeps the session on a temporary outage and saves a rotated refresh token on retry', async () => {
    service = restoreExpiredSession();
    const http = TestBed.inject(HttpTestingController);
    const firstAttempt = service.getAccessToken();
    http.expectOne(tokenUrl).error(new ProgressEvent('error'));
    await expect(firstAttempt).rejects.toMatchObject({status: 0});
    expect(sessionStorage.getItem('auth_state')).toBe(JSON.stringify(expiredSession));

    const retry = service.getAccessToken();
    http.expectOne(tokenUrl).flush({...newTokens, refresh_token: 'rotated'});
    expect(await retry).toBe('renewed');
    expect(service.authState()?.refreshToken).toBe('rotated');
  });

  it('clears the session when Cognito rejects the refresh token', async () => {
    service = restoreExpiredSession();
    const http = TestBed.inject(HttpTestingController);
    const attempt = service.getAccessToken();
    http.expectOne(tokenUrl).flush({error: 'invalid_grant'}, {status: 400, statusText: 'Bad Request'});
    expect(await attempt).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('auth_state')).toBeNull();
  });

  it('discards a renewal that completes after the session is cleared', async () => {
    service = restoreExpiredSession();
    const http = TestBed.inject(HttpTestingController);
    const attempt = service.getAccessToken();
    service.authState.set(null);
    sessionStorage.removeItem('auth_state');
    http.expectOne(tokenUrl).flush(newTokens);
    expect(await attempt).toBeNull();
    expect(sessionStorage.getItem('auth_state')).toBeNull();
  });
});
