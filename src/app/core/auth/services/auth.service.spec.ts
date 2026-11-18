import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ApplicationRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {environment} from '@environment';
import {AuthService} from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads the profile only for an authenticated session and retries after an error', async () => {
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
});
