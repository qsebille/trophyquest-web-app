import {provideRouter} from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerSearchCardComponent } from './player-search-card.component';
import {PlayerSearchItem} from '../../models/player-search-item';

describe('PlayerSearchCardComponent', () => {
  let component: PlayerSearchCardComponent;
  let fixture: ComponentFixture<PlayerSearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSearchCardComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayerSearchCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('player', {
      id: 'player-001',
      pseudo: 'Player One',
      avatarUrl: 'avatar.jpg',
      nbPlayedSuites: 12,
      nbEarnedPlatinumTrophies: 1,
      nbEarnedGoldTrophies: 2,
      nbEarnedSilverTrophies: 3,
      nbEarnedBronzeTrophies: 4,
    } satisfies PlayerSearchItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('links to the player profile', () => {
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/player/player-001');
  });

});
