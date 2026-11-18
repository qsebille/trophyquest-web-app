import {Component, input, output} from '@angular/core';

@Component({
  selector: 'tq-trophy-filters',
  templateUrl: './trophy-filters.component.html',
  styleUrl: './trophy-filters.component.scss',
})
export class TrophyFiltersComponent {
  readonly selectedPlayerId = input<string | null>(null);
  readonly earnedFilter = input<EarnedTrophyFilterState>('all');
  readonly earnedFilterChange = output<EarnedTrophyFilterState>();
  readonly hiddenFilterChange = output<boolean>();

  onEarnedFilterChange(value: string): void {
    if (value === 'all' || value === 'earned' || value === 'unearned') {
      this.earnedFilterChange.emit(value);
    }
  }
}

export type EarnedTrophyFilterState = 'all' | 'earned' | 'unearned';
