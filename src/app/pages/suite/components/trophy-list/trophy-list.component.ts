import {Component, computed, input, signal} from '@angular/core';
import {TrophyCardComponent} from '../trophy-card/trophy-card.component';
import {EarnedTrophyFilterState, TrophyFiltersComponent} from '../trophy-filters/trophy-filters.component';
import {TrophyItem} from '@shared/models/trophy-item';

@Component({
  selector: 'tq-trophy-list',
  imports: [TrophyCardComponent, TrophyFiltersComponent],
  templateUrl: './trophy-list.component.html',
  styleUrl: './trophy-list.component.scss',
})
export class TrophyListComponent {
  readonly trophies = input.required<TrophyItem[]>();
  readonly selectedPlayerId = input<string | null>(null);

  readonly showHiddenTrophies = signal(false);
  readonly earnedFilterState = signal<EarnedTrophyFilterState>('all');
  readonly earnedFilter = computed(() => this.selectedPlayerId() ? this.earnedFilterState() : 'all');

  readonly trophyGroups = computed(() => {
    const filter = this.earnedFilter();
    const groups = new Map<string, TrophyItem[]>();
    for (const trophy of this.trophies()) {
      if (filter !== 'all' && (filter === 'earned') !== Boolean(trophy.earnedAt)) {
        continue;
      }
      const group = groups.get(trophy.groupName);
      if (group) {
        group.push(trophy);
      } else {
        groups.set(trophy.groupName, [trophy]);
      }
    }

    return Array.from(groups, ([name, trophies]) => ({
      name,
      trophies: trophies.sort((a, b) => a.rank - b.rank),
    }));
  });
}
