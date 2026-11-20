import {Component, input, output} from '@angular/core';
import {EarnedTrophyFilterState} from '../../models/earned-trophy-filter-state';

@Component({
  selector: 'tq-suite-trophy-filters',
  templateUrl: './suite-trophy-filters.component.html',
  styleUrl: './suite-trophy-filters.component.scss',
})
export class SuiteTrophyFiltersComponent {
  readonly selectedPlayerId = input<string | null>(null);
  readonly earnedFilter = input<EarnedTrophyFilterState>('all');
  readonly showHiddenTrophies = input(false);
  readonly earnedFilterChange = output<EarnedTrophyFilterState>();
  readonly hiddenFilterChange = output<boolean>();

  onEarnedFilterChange(value: string): void {
    if (value === 'all' || value === 'earned' || value === 'unearned') {
      this.earnedFilterChange.emit(value);
    }
  }
}
