import {Component, computed, input, output} from '@angular/core';
import {HomeGameCard} from "@home/components/game-card/home-game-card.component";
import {HomeGameItem} from '@home/models/home-game-item';
import {Spinner} from '@shared/spinner/spinner.component';

@Component({
  selector: 'tq-home-game-list',
  imports: [
    HomeGameCard,
    Spinner,
  ],
  templateUrl: './home-game-list.component.html',
  styleUrl: './home-game-list.component.scss',
})
export class HomeGameList {
  readonly games = input<HomeGameItem[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly clickOnGame = output<string>();

  readonly hasNoRecentGames = computed(() => this.games().length === 0);
}
