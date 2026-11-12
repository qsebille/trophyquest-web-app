import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationSuiteCardComponent} from './association-suite-card.component';

describe('AssociationSuiteCardComponent', () => {
  let component: AssociationSuiteCardComponent;
  let fixture: ComponentFixture<AssociationSuiteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationSuiteCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssociationSuiteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
