import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Component, provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {provideRouter, Router} from '@angular/router';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {environment} from '@environment';

import {adminGuard} from '../auth/admin.guard';
import {AuthService} from '../auth/services/auth.service';
import {NavbarComponent} from './navbar.component';

@Component({
  selector: 'tq-dummy-component',
  template: '',
})
class DummyComponent {
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let http: HttpTestingController;
  const profileUrl = `${environment.apiUrl}/auth/me`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {path: 'home', component: DummyComponent},
          {path: 'game-search', component: DummyComponent},
          {path: 'player-search', component: DummyComponent},
          {path: 'association', component: DummyComponent, canActivate: [adminGuard]},
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('hides the association link and redirects visitors', async () => {
    await router.navigateByUrl('/association');

    expect(router.url).toBe('/home');
    expect(fixture.nativeElement.querySelector('#navbar-association-link')).toBeNull();
    http.expectNone(profileUrl);
  });

  it.each([true, false])('waits for the profile to resolve with isAdmin=%s', async (isAdmin) => {
    startSession();
    const navigation = router.navigateByUrl('/association');
    TestBed.tick();

    expect(router.url).toBe('/');
    expect(fixture.nativeElement.querySelector('#navbar-association-link')).toBeNull();
    http.expectOne(profileUrl).flush({
      id: 'user',
      email: 'camille@example.test',
      displayName: 'Camille',
      isAdmin,
    });

    await navigation;
    fixture.detectChanges();
    expect(router.url).toBe(isAdmin ? '/association' : '/home');
    expect(!!fixture.nativeElement.querySelector('#navbar-association-link')).toBe(isAdmin);
  });

  it('redirects when the profile fails to load', async () => {
    startSession();
    const navigation = router.navigateByUrl('/association');
    TestBed.tick();
    http.expectOne(profileUrl).flush(null, {status: 503, statusText: 'Service Unavailable'});

    await navigation;
    expect(router.url).toBe('/home');
    expect(fixture.nativeElement.querySelector('#navbar-association-link')).toBeNull();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the application title', () => {
    const title = fixture.nativeElement.querySelector('.navbar-title');
    expect(title?.textContent?.trim()).toBe('TrophyQuest');
  });

  it('should link to home page when clicking on trophyquest logo', async () => {
    const logo = fixture.debugElement.query(By.css('#navbar-trophyquest-logo'));
    logo.nativeElement.click();
    await fixture.whenStable();
    expect(router.url).toBe('/home');
  });

  it('should link to player search page when clicking on link', async () => {
    const playersLink = fixture.debugElement.query(By.css('#navbar-player-search-link'));
    playersLink.nativeElement.click();
    await fixture.whenStable();
    expect(router.url).toBe('/player-search');
  });

  it('should link to game search page when clicking on link', async () => {
    const gameSearchLink = fixture.debugElement.query(By.css('#navbar-game-search-link'));
    gameSearchLink.nativeElement.click();
    await fixture.whenStable();
    expect(router.url).toBe('/game-search');
  });

  function startSession(): void {
    TestBed.inject(AuthService).authState.set({
      accessToken: 'access-token',
      idToken: 'id-token',
      expiresAt: Date.now() + 60_000,
    });
  }
});
