import {effect, inject, Service, signal} from '@angular/core';
import {PlayerSearchApiService} from './player-search-api.service';
import {PlayerSearchItem} from '../models/player-search-item';

@Service()
export class PlayerSearchStoreService {
  private readonly api = inject(PlayerSearchApiService);

  private readonly _size = signal<number>(20);
  private readonly query = signal('');
  private readonly page = signal<number>(0);
  private readonly _loadedPlayers = signal<PlayerSearchItem[]>([]);

  readonly players = this.api.players(this.query, this.page, this._size);
  readonly loadedPlayers = this._loadedPlayers.asReadonly();
  readonly size = this._size.asReadonly();

  readonly background = this.api.background();

  constructor() {
    effect(() => {
      const response = this.players.value();
      if (!response || response.page !== this.page()) {
        return;
      }

      this._loadedPlayers.update(current =>
        response.page === 0 ? response.content : [...current, ...response.content],
      );
    });
  }

  setQuery(query: string) {
    if (this.query() !== query) {
      this.query.set(query);
      this.page.set(0);
    }
  }

  loadMore() {
    if (!this.players.isLoading()) {
      this.page.update(page => page + 1);
    }
  }
}
