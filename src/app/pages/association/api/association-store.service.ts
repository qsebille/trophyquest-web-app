import {effect, inject, Injectable, signal} from '@angular/core';
import {AssociationApiService} from './association-api.service';
import {AssociationItem} from '../models/association-item';

@Injectable({
  providedIn: 'root',
})
export class AssociationStoreService {
  private readonly api = inject(AssociationApiService);

  private readonly page = signal<number>(0);
  private readonly _association = signal<AssociationItem | null>(null);

  readonly associationPagination = this.api.associations(this.page);
  readonly association = this._association.asReadonly();

  constructor() {
    effect(() => {
      const response = this.associationPagination.value()
      if (!response || response.page !== this.page()) {
        return;
      }
      this._association.set(response.content[0] ?? null);
    });
  }

  init(): void {
    this.page.set(0);
  }

  nextPage(): void {
    this.page.update(page => page + 1);
  }

  previousPage(): void {
    if (this.page() === 0) return;
    this.page.update(page => page - 1);
  }
}
