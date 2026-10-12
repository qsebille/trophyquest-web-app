import {inject, Injectable, signal} from '@angular/core';
import {NotificationService} from '@shared/notification/notification.service';
import {finalize, forkJoin} from 'rxjs';
import {HomeApi} from '@home/api/home-api.service';
import {HomePlayerItem} from '@home/models/home-player-item';

@Injectable()
export class HomePlayerStore {
  private readonly homeApiService = inject(HomeApi);
  private readonly notificationService = inject(NotificationService);

  private readonly _players = signal<HomePlayerItem[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  readonly players = this._players.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  fetch(): void {
    if (this.isLoading()) return;
    this._isLoading.set(true);

    forkJoin({
      topPlayers: this.homeApiService.fetchTopPlayers(10),
    })
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
          next: data => this._players.set(data.topPlayers),
          error: error => {
            console.error('Failed to fetch recent players', error);
            this.notificationService.notifyError('Failed to fetch recent players');
          }
        },
      );
  }
}
