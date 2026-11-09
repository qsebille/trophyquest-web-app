import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TrophyCountComponent} from '../../../../shared/trophy-count/trophy-count.component';
import {PlayerSearchItem} from '../../models/player-search-item';

@Component({
  imports: [NgOptimizedImage, MatIcon, MatTooltip, TrophyCountComponent],
  selector: 'tq-player-search-card',
  styleUrl: './player-search-card.component.scss',
  templateUrl: './player-search-card.component.html',
})
export class PlayerSearchCardComponent {
  readonly player = input.required<PlayerSearchItem>();
}
