import {Component, computed, input} from '@angular/core';
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {GameTrophyItem} from '@game/models/game-trophy-item';

@Component({
  selector: 'tq-game-trophy-card',
  imports: [
    DatePipe,
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './game-trophy-card.component.html',
  styleUrl: './game-trophy-card.component.scss',
})
export class GameTrophyCardComponent {
  readonly trophy = input.required<GameTrophyItem>();
  readonly showHiddenTrophies = input<boolean>(false);

  readonly isTrophyEarned = computed(() => !!this.trophy().earnedAt);
  readonly isTrophyHidden = computed(() => this.trophy().isHidden && !this.showHiddenTrophies() && !this.isTrophyEarned());
}
