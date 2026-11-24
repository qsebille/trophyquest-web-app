import {DatePipe, DecimalPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {HistoryPoint, ImageType} from '../../api/dto/statistics-response';

@Component({
  selector: 'tq-statistics-history',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './statistics-history.component.html',
  styleUrl: './statistics-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsHistoryComponent {
  readonly history = input.required<readonly HistoryPoint[]>();
  readonly type = input.required<ImageType | 'all'>();

  protected readonly points = computed(() => {
    const type = this.type();
    const totals = new Map<string, number>();
    for (const point of this.history()) {
      if (type === 'all' || point.type === type) {
        totals.set(point.sampledAt, (totals.get(point.sampledAt) ?? 0) + point.pending);
      }
    }
    return Array.from(totals, ([sampledAt, pending]) => ({sampledAt, pending}));
  });

  protected readonly scale = computed(() => Math.max(1, ...this.points().map(point => point.pending)));
}
