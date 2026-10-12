import {inject, Injectable, signal} from '@angular/core';
import {NotificationService} from '@shared/notification/notification.service';
import {finalize} from 'rxjs';
import {HomeApi} from '@home/api/home-api.service';
import {HomeGameItem} from '@home/models/home-game-item';

@Injectable()
export class HomeGameStore {
  private readonly homeApi = inject(HomeApi);
  private readonly notificationService = inject(NotificationService);

  private readonly _recentGames = signal<HomeGameItem[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  readonly games = this._recentGames.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  reset(): void {
    this._recentGames.set([]);
    this._isLoading.set(false);
  }

  fetch(): void {
    if (this.isLoading()) return;
    this._isLoading.set(true);

    this.homeApi.fetchTopGames(20)
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
          next: data => this._recentGames.set(data),
          error: error => {
            console.error('Failed to fetch home data', error);
            this.notificationService.notifyError('Failed to retrieve top games');
          }
        },
      );
  }
}
