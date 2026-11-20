import {Component, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogState} from '@angular/material/dialog';
import {AuthService} from '@core/auth/services/auth.service';
import {NotificationService} from '@core/notification/notification.service';
import {SuiteStoreService} from '../../api/suite-store.service';

export interface SuiteEditModalData {
  suiteId: string;
  title: string;
}

@Component({
  imports: [MatDialogModule],
  templateUrl: './suite-edit-modal.component.html',
  styleUrl: './suite-edit-modal.component.scss',
})
export class SuiteEditModalComponent {
  private readonly data = inject<SuiteEditModalData>(MAT_DIALOG_DATA);
  private readonly dialog = inject<MatDialogRef<SuiteEditModalComponent>>(MatDialogRef);
  private readonly store = inject(SuiteStoreService);
  private readonly notifications = inject(NotificationService);
  private readonly isAdmin = inject(AuthService).isAdmin;
  private hasSelectedInitialTitle = false;

  readonly title = signal(this.data.title);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  selectInitialTitle(input: HTMLInputElement): void {
    if (!this.hasSelectedInitialTitle) {
      input.select();
      this.hasSelectedInitialTitle = true;
    }
  }

  changeTitle(title: string): void {
    if (!this.saving()) {
      this.title.set(title);
      this.error.set(null);
    }
  }

  cancelTitleEdit(): void {
    if (!this.saving()) {
      this.dialog.close();
    }
  }

  async saveTitle(event: Event): Promise<void> {
    event.preventDefault();
    const title = this.title().trim();
    if (!this.isAdmin() || !title || this.saving() || this.dialog.getState() !== MatDialogState.OPEN) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.dialog.disableClose = true;
    try {
      await this.store.updateTitle(this.data.suiteId, title);
      if (this.dialog.getState() === MatDialogState.OPEN && this.isAdmin()) {
        this.dialog.close();
        this.notifications.sendSuccess('Suite title updated.');
      }
    } catch {
      if (this.dialog.getState() === MatDialogState.OPEN && this.isAdmin()) {
        this.saving.set(false);
        this.dialog.disableClose = false;
        const message = 'Failed to save the title. Try again.';
        this.error.set(message);
        this.notifications.sendError(message);
      }
    }
  }
}
