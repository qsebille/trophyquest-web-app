import {computed, effect, inject, Service, signal} from '@angular/core';
import {HttpResourceRef} from '@angular/common/http';
import {Pagination} from '@core/models/pagination';
import {PlayerProfileApiService} from './player-profile-api.service';

// Each list keeps its own page, accumulated items and retry state.
function paginatedList<T>(load: (page: () => number) => HttpResourceRef<Pagination<T> | undefined>) {
  const page = signal(0);
  const items = signal<T[]>([]);
  const total = signal(0);
  const resource = load(page);
  let acceptedPage = -1;

  effect(() => {
    if (!resource.hasValue()) return;
    const response = resource.value();
    if (!response || response.page !== page() || response.page === acceptedPage) {
      return;
    }
    acceptedPage = response.page;
    total.set(response.total);
    items.update(current => response.page === 0 ? response.content : [...current, ...response.content]);
  });

  return {
    resource,
    items: items.asReadonly(),
    total: total.asReadonly(),
    hasMore: computed(() => items().length < total()),
    loadMore() {
      if (resource.isLoading()) return;
      if (resource.error()) {
        resource.reload();
      } else if (items().length < total()) {
        page.update(value => value + 1);
      }
    },
    reset() {
      page.set(0);
      items.set([]);
      total.set(0);
      acceptedPage = -1;
    },
  };
}

@Service()
export class PlayerProfileStoreService {
  private readonly api = inject(PlayerProfileApiService);
  private readonly playerId = signal<string | null>(null);
  private readonly pageSize = signal(10);

  readonly background = this.api.background(this.playerId);
  readonly summary = this.api.summary(this.playerId);
  readonly suites = paginatedList(page => this.api.suites(this.playerId, page, this.pageSize));
  readonly trophies = paginatedList(page => this.api.trophies(this.playerId, page, this.pageSize));

  setPlayerId(playerId: string | null) {
    if (this.playerId() === playerId) return;
    this.playerId.set(playerId);
    this.suites.reset();
    this.trophies.reset();
  }
}
