import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomePlayerCard} from './home-player-card.component';
import {HomePlayerItem} from '@home/models/home-player-item';

describe('HomePlayerCard', () => {
  let component: HomePlayerCard;
  let fixture: ComponentFixture<HomePlayerCard>;

  const mockPlayer = {
    playerId: 'player-1',
    pseudo: 'Player 1',
    avatarUrl: 'avatar.png',
    nbRecentBronzeTrophies: 1,
    nbRecentSilverTrophies: 2,
    nbRecentGoldTrophies: 3,
    nbRecentPlatinumTrophies: 0,
  } as HomePlayerItem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePlayerCard]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePlayerCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('player', mockPlayer);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

});
