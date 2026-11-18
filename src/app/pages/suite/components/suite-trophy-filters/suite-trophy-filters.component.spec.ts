import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SuiteTrophyFiltersComponent} from './suite-trophy-filters.component';

describe('SuiteTrophyFiltersComponent', () => {
  let component: SuiteTrophyFiltersComponent;
  let fixture: ComponentFixture<SuiteTrophyFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiteTrophyFiltersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SuiteTrophyFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
