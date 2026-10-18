import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameSuiteCardComponent} from './game-suite-card.component';
import {GameSuiteDisplayMode} from '@game/models/constants/suite-display-mode';
import {GameSuiteItem} from '@game/models/game-suite-item';

describe('GameSuiteCardComponent', () => {
  let component: GameSuiteCardComponent;
  let fixture: ComponentFixture<GameSuiteCardComponent>;

  const suiteStub: GameSuiteItem = {
    suiteId: 'suite-1',
    title: 'Suite Title',
    imageUrl: 'image.png',
    platforms: ["PS5"],
    nbPlatinumTrophies: 1,
    nbGoldTrophies: 2,
    nbSilverTrophies: 3,
    nbBronzeTrophies: 4,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSuiteCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameSuiteCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('suite', suiteStub)
    fixture.componentRef.setInput('displayMode', GameSuiteDisplayMode.SINGLE)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
