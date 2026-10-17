import {Component, effect, inject, input} from '@angular/core';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {BackgroundService} from '@core/background/background.service';
import {GameStoreService} from './api/game-store.service';
import {Router} from '@angular/router';
import {GameDetailsComponent} from './components/game-details/game-details.component';
import {GameSuiteListComponent} from '@game/components/game-suite-list/game-suite-list.component';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {GameTrophyListComponent} from '@game/components/game-trophy-list/game-trophy-list.component';
import {GamePlayersComponent} from '@game/components/game-players/game-players.component';

@Component({
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavLinkButton,
    NgbNavContent,
    NgbNavOutlet,
    GameDetailsComponent,
    GameSuiteListComponent,
    SpinnerComponent,
    GameTrophyListComponent,
    GamePlayersComponent,
  ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent {
  private readonly backgroundService = inject(BackgroundService);
  private readonly store = inject(GameStoreService);
  private readonly router = inject(Router);

  readonly gameId = input(null, {
    alias: 'gameId',
    transform: (value: string | null) => value ?? null,
  });

  readonly selectedTab = input('overview', {
    alias: 'tab',
    transform: (value: string | null) => value ?? 'overview',
  });

  readonly selectedSuiteId = input(null, {
    alias: 'suiteId',
    transform: (value: string | null) => value ?? null,
  });

  readonly selectedPlayerId = input(null, {
    alias: 'playerId',
    transform: (value: string | null) => value ?? null,
  });

  readonly selectedPlayerPage = input(0, {
    alias: 'playerPage',
    transform: (value: number | null) => value ?? 0,
  });

  readonly details = this.store.details;
  readonly suites = this.store.suites;
  readonly players = this.store.players;
  readonly trophies = this.store.trophies;

  constructor() {
    effect(() => {
      this.store.setGameId(this.gameId());
      if (this.store.background.hasValue()) {
        this.backgroundService.setBackground(this.store.background.value() ?? {url: ''});
      }
    });
    effect(() => {
      this.store.setSuiteId(this.selectedSuiteId());
    });
    effect(() => {
      this.store.setPlayerId(this.selectedPlayerId());
    });
    effect(() => {
      this.store.setPlayerPage(this.selectedPlayerPage());
    });
  }

  selectTab(tab: string): void {
    this.updateUrl({tab});
  }

  selectSuite(suiteId: string | null): void {
    this.updateUrl({suiteId});
  }

  selectPlayerPage(playerPage: number): void {
    this.updateUrl({playerPage: playerPage.toString()});
  }

  selectPlayer(playerId: string): void {
    this.updateUrl({tab: 'trophies', playerId});
  }

  private updateUrl(queryParams: Record<string, string | null>): void {
    void this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
