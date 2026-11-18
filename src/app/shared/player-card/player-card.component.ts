import {DatePipe} from '@angular/common';
import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PlayerItem} from '../models/player-item';

@Component({
  selector: 'tq-player-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
})
export class PlayerCardComponent {
  readonly player = input.required<PlayerItem>();
}
