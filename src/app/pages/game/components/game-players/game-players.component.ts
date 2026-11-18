import {Component, input} from '@angular/core';
import {PlayerCardComponent} from '@shared/player-card/player-card.component';
import {PlayerItem} from '@shared/models/player-item';

@Component({
  selector: 'tq-game-players',
  imports: [PlayerCardComponent],
  templateUrl: './game-players.component.html',
  styleUrl: './game-players.component.scss',
})
export class GamePlayersComponent {
  readonly players = input.required<PlayerItem[]>();
}
