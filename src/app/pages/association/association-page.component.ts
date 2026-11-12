import {Component, computed, inject} from '@angular/core';
import {AssociationStoreService} from './api/association-store.service';
import {
  AssociationSuiteCardComponent
} from '@association/components/association-suite-card/association-suite-card.component';
import {
  AssociationCandidateCardComponent
} from '@association/components/association-candidate-card/association-candidate-card.component';
import {AssociationValidationService} from './api/association-validation.service';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {AssociationHeaderComponent} from '@association/components/association-header/association-header.component';
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
  private readonly validationService = inject(AssociationValidationService);

  readonly associationPagination = this.store.associationPagination;
  readonly association = this.store.association;
  readonly isLoadingValidation = this.validationService.isLoading;

  readonly candidates = computed(() =>
    this.store.association()?.games.sort((a, b) => b.score - a.score) ?? []
  );

  private selectedGameId: number | null = null;


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
    if (this.selectedGameId === gameId) {
      this.selectedGameId = null;
      return;
    }
    this.selectedGameId = gameId;
  }

  isSelected(gameId: number): boolean {
    return this.selectedGameId === gameId;
  }

  hasSelectedCandidate(): boolean {
    return this.selectedGameId !== null;
  }

  validateAssociation(): void {
    const suiteId = this.association()?.suite?.suiteId;
    if (this.selectedGameId === null || !suiteId) return;
    this.validationService.validateAssociation$(suiteId, this.selectedGameId).subscribe(
      value => {
        if (value) {
          this.store.init();
        }
      }
    );
  }

  rejectAllCandidates(): void {
    const suiteId = this.association()?.suite?.suiteId;
    if (!suiteId) return;
    this.validationService.rejectAllCandidates$(suiteId).subscribe(
      value => {
        if (value) {
          this.store.init();
        }
      }
    );
  }
}
