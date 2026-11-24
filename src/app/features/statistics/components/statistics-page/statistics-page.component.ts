import {DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ImageType, imageTypeLabels} from '../../api/dto/statistics-response';
import {StatisticsApiService} from '../../api/statistics-api.service';
import {StatisticsHistoryComponent} from '../../ui/statistics-history/statistics-history.component';

@Component({
  selector: 'tq-statistics-page',
  imports: [DatePipe, DecimalPipe, PercentPipe, StatisticsHistoryComponent],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPageComponent {
  protected readonly statistics = inject(StatisticsApiService).current();
  protected readonly imageLabels = imageTypeLabels;
  protected readonly historyType = signal<ImageType | 'all'>('all');
  protected readonly totalPending = computed(() =>
    this.statistics.hasValue()
      ? this.statistics.value().images.reduce((total, image) => total + image.pending, 0)
      : 0,
  );
}
