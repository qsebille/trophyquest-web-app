import {Component, computed, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {TrophyCountComponent} from '@shared/trophy-count/trophy-count.component';
import {PlayerSuiteItem} from '../../models/player-suite-item';

@Component({
  selector: 'tq-player-suite-card',
  imports: [DatePipe, RouterLink, MatIcon, TrophyCountComponent],
  templateUrl: './player-suite-card.component.html',
  styleUrl: './player-suite-card.component.scss',
})
export class PlayerSuiteCardComponent {
  readonly suite = input.required<PlayerSuiteItem>();
  readonly playerId = input<string | null>(null);

  readonly trophyCount = computed(() => {
    const suite = this.suite();
    return suite.nbBronzeTrophies + suite.nbSilverTrophies
      + suite.nbGoldTrophies + suite.nbPlatinumTrophies;
  });

  readonly earnedTrophyCount = computed(() => {
    const suite = this.suite();
    return suite.nbEarnedBronzeTrophies + suite.nbEarnedSilverTrophies
      + suite.nbEarnedGoldTrophies + suite.nbEarnedPlatinumTrophies;
  });

  readonly completionPercent = computed(() => this.trophyCount() > 0
    ? Math.min(100, Math.max(0, Math.floor(this.earnedTrophyCount() / this.trophyCount() * 100)))
    : 0);

  readonly isComplete = computed(() => this.trophyCount() > 0
    && this.earnedTrophyCount() >= this.trophyCount());
}
