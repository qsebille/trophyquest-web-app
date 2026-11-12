import {Component, input, output} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {GameSuiteItem} from '@game/models/game-suite-item';
import {GameSuiteDisplayMode} from '@game/models/constants/suite-display-mode';
import {TrophyCountComponent} from '../../../../shared/trophy-count/trophy-count.component';

@Component({
  selector: 'tq-game-suite-card',
  imports: [
    NgOptimizedImage,
    TrophyCountComponent
  ],
  templateUrl: './game-suite-card.component.html',
  styleUrl: './game-suite-card.component.scss',
})
export class GameSuiteCardComponent {
  suite = input.required<GameSuiteItem>();
  displayMode = input.required<GameSuiteDisplayMode>();
  selectSuite = output()

  readonly displayModes = GameSuiteDisplayMode
}
