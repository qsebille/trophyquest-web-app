import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationCandidateCardComponent} from './association-candidate-card.component';
import {AssociationGameItem} from '@association/models/association-game-item';

describe('AssociationCandidateCardComponent', () => {
  let component: AssociationCandidateCardComponent;
  let fixture: ComponentFixture<AssociationCandidateCardComponent>;

  const candidateStub = {
    gameId: 'suite-001',
    platforms: ['PS4', 'PS5'],
    genres: ['Action', 'RPG'],
    themes: ['Fantasy']
  } as unknown as AssociationGameItem

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationCandidateCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssociationCandidateCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('candidate', candidateStub);
    fixture.componentRef.setInput('isSelected', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
