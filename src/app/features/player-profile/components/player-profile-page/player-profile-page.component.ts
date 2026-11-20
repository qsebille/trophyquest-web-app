import {Component, effect, inject, input} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {BackgroundService} from '@core/background/background.service';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {PlayerProfileApiService} from '../../api/player-profile-api.service';
import {PlayerProfileStoreService} from '../../api/player-profile-store.service';
import {PlayerSummaryComponent} from '../../ui/player-summary/player-summary.component';
import {PlayerSuiteCardComponent} from '../../ui/player-suite-card/player-suite-card.component';
import {PlayerTrophyCardComponent} from '../../ui/player-trophy-card/player-trophy-card.component';

@Component({
  imports: [SpinnerComponent, PlayerSummaryComponent, PlayerSuiteCardComponent, PlayerTrophyCardComponent],
  providers: [PlayerProfileApiService, PlayerProfileStoreService],
  templateUrl: './player-profile-page.component.html',
  styleUrl: './player-profile-page.component.scss',
})
export class PlayerProfilePageComponent {
  private readonly store = inject(PlayerProfileStoreService);
  private readonly background = inject(BackgroundService);
  readonly playerId = input<string | null>(null);
  readonly summary = this.store.summary;
  readonly suites = this.store.suites;
  readonly trophies = this.store.trophies;

  constructor() {
    effect(() => {
      this.store.setPlayerId(this.playerId());
    });
    effect(() => {
      const background = this.store.background;
      this.background.setBackground(background.hasValue() ? background.value() : null);
    });
  }

  get playerNotFound(): boolean {
    const error = this.summary.error();
    return error instanceof HttpErrorResponse && error.status === 404;
  }
}
