import {Component, computed, input, output} from '@angular/core';
import {HomePlayerCard} from '@home/components/player-card/home-player-card.component';
import {HomePlayerItem} from '@home/models/home-player-item';
import {Spinner} from '@shared/spinner/spinner.component';

@Component({
  selector: 'tq-home-player-list',
  imports: [
    HomePlayerCard,
    Spinner,
  ],
  templateUrl: './home-player-list.component.html',
  styleUrl: './home-player-list.component.scss',
})
export class HomePlayerList {
  readonly players = input<HomePlayerItem[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly clickOnPlayer = output<string>();
  readonly clickOnGame = output<{ playerId: string, gameId: string, trophySuiteId: string }>();

  readonly noRecentPlayers = computed(() => this.players().length == 0);
}
