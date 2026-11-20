import {Component, inject} from '@angular/core';
import {AssociationStoreService} from '../../api/association-store.service';
import {
  AssociationSuiteCardComponent
} from '@association/ui/association-suite-card/association-suite-card.component';
import {
  AssociationCandidateCardComponent
} from '@association/ui/association-candidate-card/association-candidate-card.component';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {AssociationHeaderComponent} from '@association/ui/association-header/association-header.component';
import {BackgroundService} from '@core/background/background.service';

@Component({
  imports: [
    AssociationSuiteCardComponent,
    AssociationCandidateCardComponent,
    SpinnerComponent,
    AssociationHeaderComponent
  ],
  templateUrl: './association-page.component.html',
  styleUrl: './association-page.component.scss',
})
export class AssociationPageComponent {
  private readonly store = inject(AssociationStoreService);
  private readonly backgroundService = inject(BackgroundService);

  readonly associationPagination = this.store.associationPagination;
  readonly association = this.store.association;
  readonly isLoadingValidation = this.store.isLoadingValidation;
  readonly candidates = this.store.candidates;
  readonly selectedGameId = this.store.selectedGameId;

  ngOnInit(): void {
    this.backgroundService.setBackground(null);
    this.store.init();
  }

  nextAssociation(): void {
    this.store.nextPage();
  }

  previousAssociation(): void {
    this.store.previousPage();
  }

  selectCandidate(gameId: number): void {
    this.store.selectCandidate(gameId);
  }

  validateAssociation(): void {
    this.store.validateAssociation();
  }

  rejectAllCandidates(): void {
    this.store.rejectAllCandidates();
  }
}
