import {DatePipe, DecimalPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {ApexAxisChartSeries, ApexChart, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent} from 'ng-apexcharts';
import {HistoryPoint, ImageType} from '../../api/dto/statistics-response';

@Component({
  selector: 'tq-statistics-history',
  imports: [ChartComponent, DatePipe, DecimalPipe],
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

  protected readonly series = computed<ApexAxisChartSeries>(() => [{
    name: 'Pending images',
    data: this.points().map(point => ({x: Date.parse(point.sampledAt), y: point.pending})),
  }]);

  protected readonly chart: ApexChart = {
    type: 'line',
    height: 240,
    fontFamily: 'inherit',
    animations: {enabled: false},
    toolbar: {show: false},
    zoom: {enabled: false},
  };
  protected readonly colors = ['var(--history-line-color)'];
  protected readonly stroke = {curve: 'straight', width: 2} as const;
  protected readonly markers = {size: 2};
  protected readonly xaxis: ApexXAxis = {
    type: 'datetime',
    labels: {datetimeUTC: false},
    tooltip: {enabled: false},
  };
  protected readonly yaxis: ApexYAxis = {min: 0, decimalsInFloat: 0};
  protected readonly tooltip: ApexTooltip = {
    shared: true,
    intersect: false,
    x: {format: 'dd MMM yyyy, HH:mm'},
    y: {formatter: value => value.toLocaleString()},
  };
}
