import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameSuiteCardComponent} from './game-suite-card.component';
import {
  GameTrophySuiteDisplayMode
} from '../../../../pages/game-details/models/constants/game-trophy-suite-display-mode.enum';

describe('GameTrophySuiteCardComponent', () => {
  let component: GameSuiteCardComponent;
  let fixture: ComponentFixture<GameSuiteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSuiteCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameSuiteCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trophySuite', {} as unknown as GameSuiteCardComponent)
    fixture.componentRef.setInput('displayMode', GameTrophySuiteDisplayMode.SINGLE)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
