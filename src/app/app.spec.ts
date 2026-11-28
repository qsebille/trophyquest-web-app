import {TestBed} from '@angular/core/testing';
import {App} from './app';
import {Component} from '@angular/core';
import {NavbarComponent} from '@core/navbar/navbar.component';
import {BackgroundService, DEFAULT_BACKGROUND_URL} from '@core/background/background.service';
import {IdleReloadService} from '@core/utils/idle-reload.service';

describe('App', () => {
  @Component({selector: 'tq-navbar', template: ''})
  class MockNavbarComponent {
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{provide: IdleReloadService, useValue: {start: () => {}, stop: () => {}}}],
    }).overrideComponent(App, {
      remove: {imports: [NavbarComponent]},
      add: {imports: [MockNavbarComponent]},
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('displays the default background when a custom image fails to load', () => {
    const fixture = TestBed.createComponent(App);
    const background = TestBed.inject(BackgroundService);
    const imageUrl = 'https://example.com/missing.jpg';
    background.setBackground({url: imageUrl});
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector('.app-background');
    expect(image.getAttribute('src')).toBe(imageUrl);

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(image.getAttribute('src')).toBe(DEFAULT_BACKGROUND_URL);
  });
});
