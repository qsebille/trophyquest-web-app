import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NavbarComponent} from '@core/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
import {IdleReloadService} from "@core/utils/idle-reload.service";
import {BackgroundService} from "@core/background/background.service";
import {NotificationToastComponent} from '@core/notification/notification-toast.component';

@Component({
  selector: 'tq-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    NotificationToastComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private readonly backgroundImageService = inject(BackgroundService);
  private readonly idleReloadService = inject(IdleReloadService);

  protected readonly backgroundImage = this.backgroundImageService.image;

  protected onBackgroundError(image: HTMLImageElement): void {
    if (image.getAttribute('src') === this.backgroundImage().url) {
      this.backgroundImageService.setBackground(null);
    }
  }

  ngOnInit(): void {
    this.idleReloadService.start();
  }

  ngOnDestroy(): void {
    this.idleReloadService.stop();
  }
}
