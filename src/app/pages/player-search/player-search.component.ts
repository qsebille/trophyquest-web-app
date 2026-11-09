import {Component, DestroyRef, effect, inject, input} from '@angular/core';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {PlayerSearchStoreService} from './api/player-search-store.service';
import {PlayerSearchCardComponent} from './components/player-search-card/player-search-card.component';

@Component({
  imports: [PlayerSearchCardComponent],
  selector: 'tq-player-search',
  styleUrl: './player-search.component.scss',
  templateUrl: './player-search.component.html',
})
export class PlayerSearchComponent {
  private readonly store = inject(PlayerSearchStoreService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchQueryChanges = new Subject<string>();

  readonly query = input('', {
    alias: 'query',
    transform: (query: string | null | undefined) => query ?? '',
  });

  readonly players = this.store.players;
  readonly loadedPlayers = this.store.loadedPlayers;
  readonly size = this.store.size;

  constructor() {
    effect(() => this.store.setQuery(this.query()));

    this.searchQueryChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(query => {
      this.router.navigate([], {
        queryParams: {query: query || null},
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      this.store.setQuery(query);
    });
  }

  changeSearchQuery(query: string) {
    this.searchQueryChanges.next(query);
  }

  loadMore() {
    this.store.loadMore();
  }
}
