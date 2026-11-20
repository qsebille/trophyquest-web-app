import {Component, computed, input} from '@angular/core';
import {SuiteTrophyCardComponent} from '../suite-trophy-card/suite-trophy-card.component';
import {EarnedTrophyFilterState} from '../../models/earned-trophy-filter-state';
import {TrophyItem} from '@shared/models/trophy-item';

@Component({
  selector: 'tq-suite-trophy-list',
  imports: [SuiteTrophyCardComponent],
  templateUrl: './suite-trophy-list.component.html',
  styleUrl: './suite-trophy-list.component.scss',
})
export class SuiteTrophyListComponent {
  readonly trophies = input.required<TrophyItem[]>();
  readonly showHiddenTrophies = input(false);
  readonly earnedFilter = input<EarnedTrophyFilterState>('all');

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
