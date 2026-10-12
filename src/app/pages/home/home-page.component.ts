import {Component, inject} from '@angular/core';
import {HomePlayerList} from "@home/components/player-list/home-player-list.component";
import {HomeGameList} from "@home/components/game-list/home-game-list.component";
import {BackgroundImageService} from "@core/background/background-image.service";
import {HomeGameStore} from '@home/stores/home-game-store.service';
import {HomePlayerStore} from '@home/stores/home-player-store.service';


@Component({
  imports: [
    HomePlayerList,
    HomeGameList,

  ],
  providers: [
    HomeGameStore,
    HomePlayerStore,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly playerStore = inject(HomePlayerStore);
  private readonly gameStore = inject(HomeGameStore);
  private readonly backgroundImageService = inject(BackgroundImageService);

  games = this.gameStore.games;
  isLoadingGames = this.gameStore.isLoading;

  players = this.playerStore.players;
  isLoadingPlayers = this.playerStore.isLoading;

  ngOnInit(): void {
    this.backgroundImageService.useTopPlayedGame();
    this.playerStore.fetch();
    this.gameStore.fetch();
  }

  goToPlayerPage(playerId: string) {
    console.info("To Be Implemented", playerId)
  }

  goToGamePage(gameId: string) {
    console.info("To Be Implemented", gameId)
  }

}
