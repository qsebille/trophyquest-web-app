import {HttpErrorResponse} from '@angular/common/http';
import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '@core/auth/services/auth.service';

@Component({
  selector: 'tq-account-page',
  imports: [FormsModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent {
  protected readonly authService = inject(AuthService);
  protected readonly maxNicknameLength = 30;
  protected readonly draft = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal<string | null>(null);
  private readonly nickname = computed(() => this.draft()?.trim() ?? '');
  protected readonly canSave = computed(() => {
    const nickname = this.nickname();
    return !this.saving()
      && nickname.length >= 3
      && nickname.length <= this.maxNicknameLength
      && nickname !== this.authService.currentUser()?.displayName;
  });

  protected editNickname(value: string): void {
    this.draft.set(value);
    this.saved.set(false);
    this.saveError.set(null);
  }

  protected async saveNickname(): Promise<void> {
    if (!this.canSave()) {
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);
    try {
      await this.authService.updateDisplayName(this.nickname());
      this.draft.set(null);
      this.saved.set(true);
    } catch (error) {
      this.saveError.set(this.getSaveError(error));
    } finally {
      this.saving.set(false);
    }
  }

  private getSaveError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          return 'Cognito rejected this nickname. Try a different one.';
        case 401:
        case 403:
          return 'Your session cannot update your nickname. Sign in again and retry.';
        case 409:
          return 'This nickname is already in use.';
      }
    }
    return 'Could not save your nickname. Try again.';
  }
}
