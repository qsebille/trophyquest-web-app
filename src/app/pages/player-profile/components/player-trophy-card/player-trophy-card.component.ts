import {Component, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {PlayerTrophyItem} from '../../models/player-trophy-item';

@Component({
  selector: 'tq-player-trophy-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './player-trophy-card.component.html',
  styleUrl: './player-trophy-card.component.scss',
})
export class PlayerTrophyCardComponent {
  readonly trophy = input.required<PlayerTrophyItem>();
  readonly playerId = input<string | null>(null);
}
