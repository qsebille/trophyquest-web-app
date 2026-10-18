import {Component, input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  imports: [
    NgOptimizedImage
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
