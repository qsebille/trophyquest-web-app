import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SuiteTrophyCardComponent} from './suite-trophy-card.component';
import {TrophyItem} from '@shared/models/trophy-item';

describe('SuiteTrophyCardComponent', () => {
  let component: SuiteTrophyCardComponent;
  let fixture: ComponentFixture<SuiteTrophyCardComponent>;

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
      imports: [SuiteTrophyCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SuiteTrophyCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trophy', trophyMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
