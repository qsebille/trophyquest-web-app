import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrophyFiltersComponent} from './trophy-filters.component';

describe('TrophyFiltersComponent', () => {
  let component: TrophyFiltersComponent;
  let fixture: ComponentFixture<TrophyFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrophyFiltersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrophyFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
