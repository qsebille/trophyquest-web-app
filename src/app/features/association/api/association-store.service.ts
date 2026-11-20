import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {NotificationService} from '@core/notification/notification.service';
import {catchError, delay, finalize, Observable, of} from 'rxjs';
import {AssociationApiService} from './association-api.service';
import {AssociationItem} from './dto/association-item';

@Injectable({
  providedIn: 'root',
})
export class AssociationStoreService {
  private readonly api = inject(AssociationApiService);
  private readonly notifications = inject(NotificationService);

  private readonly page = signal<number>(0);
  private readonly _association = signal<AssociationItem | null>(null);
  private readonly selection = signal<number | null>(null);
  private readonly submitting = signal(false);

  readonly associationPagination = this.api.associations(this.page);
  readonly association = this._association.asReadonly();
  readonly candidates = computed(() => [...(this.association()?.games ?? [])].sort((a, b) => b.score - a.score));
  readonly selectedGameId = this.selection.asReadonly();
  readonly isLoadingValidation = this.submitting.asReadonly();

  constructor() {
    effect(() => {
      const response = this.associationPagination.value();
      if (!response || response.page !== this.page()) {
        return;
      }
      this._association.set(response.content[0] ?? null);
    });
  }

  init(): void {
    this.selection.set(null);
    if (this.page() === 0) {
      this.associationPagination.reload();
    } else {
      this.page.set(0);
    }
  }

  nextPage(): void {
    this.selection.set(null);
    this.page.update(page => page + 1);
  }

  previousPage(): void {
    if (this.page() === 0) return;
    this.selection.set(null);
    this.page.update(page => page - 1);
  }

  selectCandidate(gameId: number): void {
    this.selection.update(selected => selected === gameId ? null : gameId);
  }

  validateAssociation(): void {
    const suiteId = this.association()?.suite.suiteId;
    const gameId = this.selection();
    if (!suiteId || gameId === null || this.submitting()) return;

    this.submit(this.api.validateAssociation(suiteId, gameId),
      'Association validated', 'Failed to validate association');
  }

  rejectAllCandidates(): void {
    const suiteId = this.association()?.suite.suiteId;
    if (!suiteId || this.submitting()) return;

    this.submit(this.api.rejectAllCandidates(suiteId),
      'All candidates rejected', 'Failed to reject all candidates');
  }

  private submit(request: Observable<boolean>, successMessage: string, errorMessage: string): void {
    this.submitting.set(true);
    request.pipe(
      delay(1000),
      catchError(() => of(false)),
      finalize(() => this.submitting.set(false)),
    ).subscribe(success => {
      if (success) {
        this.notifications.sendSuccess(successMessage);
        this.init();
      } else {
        this.notifications.sendError(errorMessage);
      }
    });
  }
}
