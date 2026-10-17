import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameTrophyCardComponent} from './game-trophy-card.component';
import {GameTrophyItem} from '@game/models/game-trophy-item';

describe('GameTrophyCardComponent', () => {
  let component: GameTrophyCardComponent;
  let fixture: ComponentFixture<GameTrophyCardComponent>;

  const trophyMock: GameTrophyItem = {
    trophyId: 'trophy-1',
    rank: 1,
    title: 'Trophy 1',
    description: 'trophy-1.png',
    color: 'bronze',
    isHidden: false,
    iconUrl: 'trophy-1.png',
    groupName: 'default',
    earnedAt: null
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTrophyCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameTrophyCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trophy', trophyMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
