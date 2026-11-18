import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {SuiteCardComponent} from './suite-card.component';
import {SuiteItem} from '@shared/models/suite-item';

describe('SuiteCardComponent', () => {
  let component: SuiteCardComponent;
  let fixture: ComponentFixture<SuiteCardComponent>;

  const suiteStub: SuiteItem = {
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
      imports: [SuiteCardComponent],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SuiteCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('suite', suiteStub)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
