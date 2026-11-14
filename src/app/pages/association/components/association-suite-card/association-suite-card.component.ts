import {Component, computed, input} from '@angular/core';
import {AssociationSuiteItem} from '../../models/association-suite-item';
import {NgOptimizedImage} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'tq-association-suite-card',
  imports: [
    NgOptimizedImage,
    MatTooltip,
  ],
  templateUrl: './association-suite-card.component.html',
  styleUrl: './association-suite-card.component.scss',
})
export class AssociationSuiteCardComponent {
  readonly suite = input.required<AssociationSuiteItem>();

  readonly imageUrl = computed(() => this.suite().imageUrl)
}
