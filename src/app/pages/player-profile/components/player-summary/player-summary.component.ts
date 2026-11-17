import {Component, input} from '@angular/core';
import {TrophyCountComponent} from '@shared/trophy-count/trophy-count.component';
import {PlayerSummaryResponse} from '../../models/player-summary-response';

@Component({
  selector: 'tq-player-summary',
  imports: [TrophyCountComponent],
  templateUrl: './player-summary.component.html',
  styleUrl: './player-summary.component.scss',
})
export class PlayerSummaryComponent {
  readonly player = input.required<PlayerSummaryResponse>();
}
