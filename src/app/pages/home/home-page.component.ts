import {Component, effect, inject} from '@angular/core';
import {BackgroundService} from "@core/background/background.service";
import {HomeApiService} from '@home/api/home-api.service';
import {HomeGameCardComponent} from '@home/components/game-card/home-game-card.component';
import {SpinnerComponent} from '@core/spinner/spinner.component';
import {HomePlayerCardComponent} from '@home/components/player-card/home-player-card.component';
import {NavigatorService} from '@core/routing/navigator.service';


@Component({
  imports: [
    HomeGameCardComponent,
    SpinnerComponent,
    HomePlayerCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly backgroundService = inject(BackgroundService);
  private readonly homeApiService = inject(HomeApiService);
  private readonly navigator = inject(NavigatorService);

  readonly games = this.homeApiService.topGames(() => 10);
  readonly players = this.homeApiService.topPlayers(() => 10);
  readonly backgroundImage = this.homeApiService.background();

  constructor() {
    effect(() => {
      if (this.backgroundImage.hasValue()) {
        this.backgroundService.setBackground(
          this.backgroundImage.value() ?? {url: ''}
        );
      }
    });
  }

  goToGamePage(gameId: string) {
    this.navigator.goToGamePage(gameId);
  }
}
