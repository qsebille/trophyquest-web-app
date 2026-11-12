import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationSuiteCardComponent} from './association-suite-card.component';
import {AssociationSuiteItem} from '@association/models/association-suite-item';

describe('AssociationSuiteCardComponent', () => {
  let component: AssociationSuiteCardComponent;
  let fixture: ComponentFixture<AssociationSuiteCardComponent>;

  const suiteStub = {
    suiteId: 'suite-123'
  } as AssociationSuiteItem

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationSuiteCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssociationSuiteCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('suite', suiteStub)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
