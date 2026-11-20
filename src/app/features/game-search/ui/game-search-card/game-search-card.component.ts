import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {GameSearchItem} from '@game-search/api/dto/game-search-item.model';
import {NgOptimizedImage} from '@angular/common';
import {TrophyCountComponent} from '@shared/trophy-count/trophy-count.component';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  imports: [
    NgOptimizedImage,
    TrophyCountComponent,
    MatIcon,
    MatTooltip,
    RouterLink,
  ],
  selector: 'tq-game-search-card',
  styleUrl: './game-search-card.component.scss',
  templateUrl: './game-search-card.component.html',
})
export class GameSearchCardComponent {
  readonly game = input.required<GameSearchItem>();
}
