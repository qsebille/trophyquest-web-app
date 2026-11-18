import {Component, input} from '@angular/core';
import {SuiteCardComponent} from '@shared/suite-card/suite-card.component';
import {SuiteItem} from '@shared/models/suite-item';

@Component({
  selector: 'tq-game-suite-list',
  imports: [SuiteCardComponent],
  templateUrl: './game-suite-list.component.html',
  styleUrl: './game-suite-list.component.scss',
})
export class GameSuiteListComponent {
  readonly suites = input.required<SuiteItem[]>();
}
