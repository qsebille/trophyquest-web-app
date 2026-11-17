import {Component, input} from '@angular/core';
import {DecimalPipe, NgOptimizedImage} from "@angular/common";

@Component({
  imports: [
    NgOptimizedImage,
    DecimalPipe
  ],
  selector: 'tq-trophy-count',
  styleUrl: './trophy-count.component.scss',
  templateUrl: './trophy-count.component.html',
})
export class TrophyCountComponent {
  readonly platinumCount = input.required<number>();
  readonly goldCount = input.required<number>();
  readonly silverCount = input.required<number>();
  readonly bronzeCount = input.required<number>();
  readonly size = input<number>(32);
}
