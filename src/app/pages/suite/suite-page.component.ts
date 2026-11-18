import {Component, computed, effect, inject, input, linkedSignal} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {RouterLink} from '@angular/router';
import {BackgroundService} from '@core/background/background.service';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {GameApiService} from '@game/api/game-api.service';
import {SuiteTrophyListComponent} from './components/suite-trophy-list/suite-trophy-list.component';
import {PlayerCardComponent} from '@shared/player-card/player-card.component';
import {SuiteCardComponent} from '@shared/suite-card/suite-card.component';
import {TrophyCountComponent} from '@shared/trophy-count/trophy-count.component';
import {PlayerProfileApiService} from '../player-profile/api/player-profile-api.service';
import {SuiteApiService} from './api/suite-api.service';
import {SuiteTrophyFiltersComponent} from './components/suite-trophy-filters/suite-trophy-filters.component';
import {EarnedTrophyFilterState} from './models/earned-trophy-filter-state';

@Component({
  imports: [
    RouterLink, SpinnerComponent, SuiteCardComponent, PlayerCardComponent,
    SuiteTrophyFiltersComponent, SuiteTrophyListComponent, TrophyCountComponent,
  ],
  templateUrl: './suite-page.component.html',
  styleUrl: './suite-page.component.scss',
})
export class SuitePageComponent {
  private readonly api = inject(SuiteApiService);
  private readonly backgroundService = inject(BackgroundService);

  readonly suiteId = input<string | null>(null);
  readonly selectedTab = input('trophies', {
    alias: 'tab',
    transform: (value: string | undefined) => value === 'players' ? 'players' : 'trophies',
  });
  readonly playerId = input<string | null>(null);
  readonly playerPage = input(0, {
    transform: (value: string | undefined) => {
      const page = Number(value);
      return Number.isInteger(page) && page >= 0 && page <= 2147483647 ? page : 0;
    },
  });

  readonly suite = this.api.details(this.suiteId);
  private readonly background = this.api.background(this.suiteId);
  readonly game = inject(GameApiService).details(() => {
    const gameId = this.suite.hasValue() ? this.suite.value().gameId : null;
    return gameId == null ? null : String(gameId);
  });
  readonly trophies = this.api.trophies(() => this.suiteIdFor('trophies'), this.playerId);
  private readonly trophyFilterContext = computed(() => [this.suiteId(), this.selectedTab(), this.playerId()]);
  readonly showHiddenTrophies = linkedSignal({source: this.trophyFilterContext, computation: () => false});
  readonly earnedFilter = linkedSignal({
    source: this.trophyFilterContext,
    computation: (): EarnedTrophyFilterState => 'all',
  });
  readonly players = this.api.players(() => this.suiteIdFor('players'), this.playerPage);
  readonly selectedPlayer = inject(PlayerProfileApiService).summary(() =>
    this.suiteIdFor('trophies') ? this.playerId() : null);

  readonly suiteNotFound = computed(() => {
    const error = this.suite.error();
    return error instanceof HttpErrorResponse && error.status === 404;
  });

  constructor() {
    effect(() => {
      this.backgroundService.setBackground(this.background.hasValue() ? this.background.value() : null);
    });
  }

  private suiteIdFor(tab: string): string | null {
    return this.selectedTab() === tab && this.suite.hasValue() ? this.suite.value().suiteId : null;
  }
}
