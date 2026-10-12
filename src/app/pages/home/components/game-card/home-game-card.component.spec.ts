import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeGameCard} from './home-game-card.component';
import {HomeGameItem} from '@home/models/home-game-item';

describe('HomeGameCard', () => {
  let component: HomeGameCard;
  let fixture: ComponentFixture<HomeGameCard>;

  const mockGame = {
    gameId: '001',
    title: 'Game 1',
    coverUrl: 'game.png',
    nbRecentPlayers: 1,
  } as HomeGameItem

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGameCard]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeGameCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('game', mockGame);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
