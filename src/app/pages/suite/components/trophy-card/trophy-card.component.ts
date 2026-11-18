import {Component, computed, input} from '@angular/core';
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {TrophyItem} from '@shared/models/trophy-item';

@Component({
  selector: 'tq-trophy-card',
  imports: [
    DatePipe,
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './trophy-card.component.html',
  styleUrl: './trophy-card.component.scss',
})
export class TrophyCardComponent {
  readonly trophy = input.required<TrophyItem>();
  readonly showHiddenTrophies = input<boolean>(false);

  readonly isTrophyEarned = computed(() => !!this.trophy().earnedAt);
  readonly isTrophyHidden = computed(() => this.trophy().isHidden && !this.showHiddenTrophies() && !this.isTrophyEarned());
}
