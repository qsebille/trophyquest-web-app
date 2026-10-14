import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomePlayerCardComponent} from './home-player-card.component';
import {HomePlayerItem} from '@home/api/models/home-player-item';

describe('HomePlayerCardComponent', () => {
  let component: HomePlayerCardComponent;
  let fixture: ComponentFixture<HomePlayerCardComponent>;

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
      imports: [HomePlayerCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePlayerCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('player', mockPlayer);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

});
