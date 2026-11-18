import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SuiteItem} from '../models/suite-item';

@Component({
  selector: 'tq-suite-card',
  imports: [RouterLink],
  templateUrl: './suite-card.component.html',
  styleUrl: './suite-card.component.scss',
})
export class SuiteCardComponent {
  readonly suite = input.required<SuiteItem>();
  readonly heading = input(false);
}
