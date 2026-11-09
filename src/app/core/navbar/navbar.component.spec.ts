import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {provideRouter, Router} from '@angular/router';
import {beforeEach, describe, expect, it} from 'vitest';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([
          {path: 'home', component: DummyComponent},
          {path: 'game-search', component: DummyComponent},
          {path: 'player-search', component: DummyComponent},
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
});
