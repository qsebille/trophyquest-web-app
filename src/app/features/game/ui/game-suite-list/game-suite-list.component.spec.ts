import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameSuiteListComponent} from './game-suite-list.component';

describe('GameTrophySuiteListComponent', () => {
  let component: GameSuiteListComponent;
  let fixture: ComponentFixture<GameSuiteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSuiteListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameSuiteListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('suites', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
