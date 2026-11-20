import {Component, effect, inject, input} from '@angular/core';
import {BackgroundService} from '@core/background/background.service';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {GameStoreService} from '../../api/game-store.service';
import {GameDetailsComponent} from '../../ui/game-details/game-details.component';
import {GamePlayersComponent} from '../../ui/game-players/game-players.component';
import {GameSuiteListComponent} from '../../ui/game-suite-list/game-suite-list.component';

@Component({
  imports: [GameDetailsComponent, GameSuiteListComponent, GamePlayersComponent, SpinnerComponent],
  providers: [GameStoreService],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent {
  private readonly backgroundService = inject(BackgroundService);
  private readonly store = inject(GameStoreService);

  readonly gameId = input<string | null>(null);
  readonly details = this.store.details;
  readonly suites = this.store.suites;
  readonly players = this.store.players;

  constructor() {
    effect(() => this.store.setGameId(this.gameId()));
    effect(() => {
      const background = this.store.background;
      this.backgroundService.setBackground(background.hasValue() ? background.value() : null);
    });
  }
}
