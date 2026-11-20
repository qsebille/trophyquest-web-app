import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from "@angular/material/icon";
import {NgOptimizedImage} from "@angular/common";
import {HomeGameItem} from '@home/api/dto/home-game-item';

@Component({
  selector: 'tq-home-game-card',
  imports: [
    MatIconModule,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './home-game-card.component.html',
  styleUrl: './home-game-card.component.scss',
})
export class HomeGameCardComponent {
  readonly game = input.required<HomeGameItem>();
}
