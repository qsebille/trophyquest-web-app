import {Component, input, output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgOptimizedImage} from "@angular/common";
import {HomeGameItem} from '@home/api/models/home-game-item';

@Component({
  selector: 'tq-home-game-card',
  imports: [
    MatIconModule,
    NgOptimizedImage,
  ],
  templateUrl: './home-game-card.component.html',
  styleUrl: './home-game-card.component.scss',
})
export class HomeGameCardComponent {
  readonly game = input.required<HomeGameItem>();
  readonly clickGameTitle = output();
}
