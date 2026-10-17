import {Component, input, output} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {GameSuiteItem} from '@game/models/game-suite-item';
import {GameSuiteDisplayMode} from '@game/models/constants/suite-display-mode';
import {TrophyType} from '@core/models/trophy-type.enum';

@Component({
  selector: 'tq-game-suite-card',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './game-suite-card.component.html',
  styleUrl: './game-suite-card.component.scss',
})
export class GameSuiteCardComponent {
  suite = input.required<GameSuiteItem>();
  displayMode = input.required<GameSuiteDisplayMode>();
  selectSuite = output()

  readonly trophyTypes = [TrophyType.PLATINUM, TrophyType.GOLD, TrophyType.SILVER, TrophyType.BRONZE];
  readonly displayModes = GameSuiteDisplayMode

  countTrophyByColor(trophyType: TrophyType): number {
    switch (trophyType) {
      case TrophyType.PLATINUM:
        return this.suite().nbPlatinumTrophies;
      case TrophyType.GOLD:
        return this.suite().nbGoldTrophies;
      case TrophyType.SILVER:
        return this.suite().nbSilverTrophies;
      case TrophyType.BRONZE:
        return this.suite().nbBronzeTrophies;
      default:
        return 0;
    }
  }
}
