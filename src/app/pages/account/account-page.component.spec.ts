import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {environment} from '@environment';
import {authInterceptor} from '@core/auth/interceptors/auth-interceptor';
import {App} from '../../app';
import {routes} from '../../app.routes';

describe('Account page', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => sessionStorage.removeItem('auth_state'));

  it('redirects unauthenticated visitors to the home page', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/account');

    expect(router.url).toBe('/home');
  });

  it('opens from the account menu and updates the navbar after the nickname is saved', async () => {
    sessionStorage.setItem('auth_state', JSON.stringify({
      accessToken: 'test-access-token',
      idToken: 'test-id-token',
      expiresAt: Date.now() + 3600000,
    }));
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(App);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    const profileUrl = `${environment.apiUrl}/auth/me`;
    const profile = {id: 'test-user', email: 'camille@example.test', displayName: 'Camille'};
    http.expectOne({method: 'GET', url: profileUrl}).flush(profile);
    fixture.detectChanges();

    const menu = element.querySelector<HTMLButtonElement>('#userMenu')!;
    menu.click();
    fixture.detectChanges();
    element.querySelector<HTMLAnchorElement>('a[href="/account"]')!.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/account');
    fixture.detectChanges();
    await fixture.whenStable();

    const input = element.querySelector<HTMLInputElement>('#nickname')!;
    const save = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(input.value).toBe('Camille');
    expect(save.disabled).toBe(true);
    input.value = '  Nouveau pseudo  ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    save.click();
    fixture.detectChanges();
    const rejectedUpdate = http.expectOne({method: 'PUT', url: profileUrl});
    expect(rejectedUpdate.request.body).toEqual({displayName: 'Nouveau pseudo'});
    expect(rejectedUpdate.request.headers.get('Authorization')).toBe('Bearer test-access-token');
    expect(save.disabled).toBe(true);
    rejectedUpdate.flush(null, {status: 409, statusText: 'Conflict'});
    await fixture.whenStable();
    fixture.detectChanges();
    expect(menu.textContent?.trim()).toBe('Camille');
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('already in use');

    save.click();
    http.expectOne({method: 'PUT', url: profileUrl}).flush({...profile, displayName: 'Nouveau pseudo'});
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.querySelector('[role="status"]')?.textContent).toBe('Nickname saved.');
    expect(menu.textContent?.trim()).toBe('Nouveau pseudo');
    http.verify();
  });
});
