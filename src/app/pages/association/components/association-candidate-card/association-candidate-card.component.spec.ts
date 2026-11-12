import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationCandidateCardComponent} from './association-candidate-card.component';

describe('AssociationCandidateCardComponent', () => {
  let component: AssociationCandidateCardComponent;
  let fixture: ComponentFixture<AssociationCandidateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationCandidateCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssociationCandidateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
