import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {HomeGameCardComponent} from './home-game-card.component';
import {HomeGameItem} from '@home/api/models/home-game-item';

describe('HomeGameCardComponent', () => {
  let component: HomeGameCardComponent;
  let fixture: ComponentFixture<HomeGameCardComponent>;

  const mockGame = {
    gameId: '001',
    title: 'Game 1',
    coverUrl: 'game.png',
    nbRecentPlayers: 1,
  } as HomeGameItem

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGameCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGameCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('game', mockGame);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the game page', () => {
    expect(fixture.nativeElement.querySelector('a.game-title').getAttribute('href')).toBe('/game/001');
  });
});
