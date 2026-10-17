import {Component, computed, effect, input, output, untracked} from '@angular/core';
import {GameSuiteCardComponent} from '@game/components/game-suite-card/game-suite-card.component';
import {GameSuiteDisplayMode} from '../../models/constants/suite-display-mode';
import {GameSuiteItem} from '../../models/game-suite-item';

@Component({
  selector: 'tq-game-suite-list',
  imports: [
    GameSuiteCardComponent
  ],
  templateUrl: './game-suite-list.component.html',
  styleUrl: './game-suite-list.component.scss',
})
export class GameSuiteListComponent {
  suites = input.required<GameSuiteItem[]>();
  suiteId = input<string | null>(null);
  selectSuite = output<string | null>();

  constructor() {
    effect(() => {
      const suites = this.suites();
      const suiteId = this.suiteId();

      if (suites.length === 1 && suiteId !== suites[0].suiteId) {
        untracked(() => this.selectSuite.emit(suites[0].suiteId));
      }
    });
  }

  displayMode = computed(() => {
    if (this.suites().length === 1) return GameSuiteDisplayMode.SINGLE;

    return this.suiteId() == null ? GameSuiteDisplayMode.MULTIPLE : GameSuiteDisplayMode.SINGLE;
  });

  displayedSuites = computed(() => {
    if (this.suiteId() == null) {
      return this.suites();
    } else {
      return this.suites().filter(ts => ts.suiteId === this.suiteId());
    }
  });

  displayReturnToSuiteListButton = computed(() =>
    this.displayMode() === GameSuiteDisplayMode.SINGLE && this.suites().length > 1
  );
}
