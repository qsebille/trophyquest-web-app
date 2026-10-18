import {effect, inject, Service, signal} from '@angular/core';
import {GameSearchApiService} from './game-search-api.service';
import {GameSearchItem} from '@game-search/models/game-search-item.model';

@Service()
export class GameSearchStoreService {
  private readonly api = inject(GameSearchApiService);

  private readonly _size = signal<number>(20);
  private readonly query = signal<string | null>(null);
  private readonly page = signal<number>(0);
  private readonly _loadedGames = signal<GameSearchItem[]>([]);

  readonly games = this.api.games(this.query, this.page, this._size);
  readonly loadedGames = this._loadedGames.asReadonly();
  readonly background = this.api.background();
  readonly size = this._size.asReadonly();

  constructor() {
    effect(() => {
      const response = this.games.value()
      if (!response || response.page !== this.page()) {
        return;
      }
      this._loadedGames.update(current =>
        response.page === 0 ? response.content : [...current, ...response.content],
      );
    })
  }

  setQuery(query: string | null) {
    if (this.query() !== query) {
      this.query.set(query);
      this.page.set(0);
    }
  }

  loadMore() {
    if (!this.games.isLoading()) {
      this.page.update(page => page + 1);
    }
  }
}
