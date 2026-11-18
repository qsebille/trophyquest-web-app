import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrophyCardComponent} from './trophy-card.component';
import {TrophyItem} from '@shared/models/trophy-item';

describe('TrophyCardComponent', () => {
  let component: TrophyCardComponent;
  let fixture: ComponentFixture<TrophyCardComponent>;

  const trophyMock: TrophyItem = {
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
      imports: [TrophyCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrophyCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trophy', trophyMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
