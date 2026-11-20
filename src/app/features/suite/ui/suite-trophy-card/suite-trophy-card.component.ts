import {Component, computed, input} from '@angular/core';
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {TrophyItem} from '@shared/models/trophy-item';

@Component({
  selector: 'tq-suite-trophy-card',
  imports: [
    DatePipe,
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './suite-trophy-card.component.html',
  styleUrl: './suite-trophy-card.component.scss',
})
export class SuiteTrophyCardComponent {
  readonly trophy = input.required<TrophyItem>();
  readonly showHiddenTrophies = input<boolean>(false);

  readonly isTrophyEarned = computed(() => !!this.trophy().earnedAt);
  readonly isTrophyHidden = computed(() => this.trophy().isHidden && !this.showHiddenTrophies() && !this.isTrophyEarned());
}
