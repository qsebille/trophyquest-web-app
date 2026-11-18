import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {NavigationEnd, provideRouter, Router} from '@angular/router';
import {environment} from '@environment';
import {App} from '../../../app';
import {routes} from '../../../app.routes';
import {authInterceptor} from '../interceptors/auth-interceptor';
import {filter, firstValueFrom} from 'rxjs';

describe('AuthCallbackComponent', () => {
  afterEach(() => {
    sessionStorage.removeItem('auth_state');
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('pkce_code_verifier');
  });

  it('displays the profile name in the navbar after returning from Cognito', async () => {
    sessionStorage.setItem('oauth_state', 'test-state');
    sessionStorage.setItem('pkce_code_verifier', 'test-verifier');
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#registerMenu')).not.toBeNull();

    await router.navigateByUrl('/auth/callback?code=test-code&state=test-state');
    fixture.detectChanges();

    const homeNavigation = firstValueFrom(router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/home'),
    ));
    http.expectOne({method: 'POST', url: `${environment.cognito.domain}/oauth2/token`}).flush({
      access_token: 'test-access-token',
      id_token: 'test-id-token',
      expires_in: 3600,
    });
    await homeNavigation;

    const profileRequest = http.expectOne({method: 'GET', url: `${environment.apiUrl}/auth/me`});
    expect(profileRequest.request.headers.get('Authorization')).toBe('Bearer test-access-token');
    profileRequest.flush({id: 'test-user', email: 'camille@example.test', displayName: 'Camille'});

    fixture.detectChanges();
    const homeUrl = `${environment.apiUrl}/home`;
    http.expectOne(`${homeUrl}/background`).flush({url: null});
    http.expectOne(`${homeUrl}/top-games?size=10`).flush([]);
    http.expectOne(`${homeUrl}/top-players?size=10`).flush([]);

    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#userMenu')?.textContent.trim()).toBe('Camille');
    http.verify();
  });
});
