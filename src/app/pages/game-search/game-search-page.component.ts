import {Component, DestroyRef, effect, inject, input} from '@angular/core';
import {GameSearchStoreService} from './api/game-search-store.service';
import {GameSearchCardComponent} from '@game-search/components/game-search-card/game-search-card.component';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NavigatorService} from '@core/routing/navigator.service';
import {BackgroundService} from '@core/background/background.service';
import {Router} from '@angular/router';

@Component({
  imports: [
    GameSearchCardComponent
  ],
  styleUrl: './game-search-page.component.scss',
  templateUrl: './game-search-page.component.html',
})
export class GameSearchPageComponent {
  private readonly store = inject(GameSearchStoreService);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchQueryChanges = new Subject<string>();
  private readonly navigator = inject(NavigatorService);
  private readonly backgroundService = inject(BackgroundService);

  readonly query = input(null, {
    alias: 'query',
    transform: (query: string) => query ?? null
  });

  readonly games = this.store.games;
  readonly size = this.store.size;
  readonly loadedGames = this.store.loadedGames;
  readonly background = this.store.background;

  constructor() {
    effect(() => {
      if (this.background.hasValue()) {
        this.backgroundService.setBackground(this.background.value());
      }
    })
    effect(() => this.store.setQuery(this.query()))

    this.searchQueryChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(query => {
      this.router.navigate([], {queryParams: {query}, queryParamsHandling: 'merge', replaceUrl: true});
      this.store.setQuery(query)
    });
  }

  changeSearchQuery(query: string) {
    this.searchQueryChanges.next(query);
  }

  clickGameTitle(gameId: string) {
    this.navigator.goToGamePage(gameId);
  }

  loadMore() {
    this.store.loadMore();
  }
}
