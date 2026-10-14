import {Component, computed, inject} from '@angular/core';
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
export class App {
  private readonly backgroundImageService = inject(BackgroundService);
  private readonly idleReloadService = inject(IdleReloadService);

  readonly backgroundUrl = computed(() => {
    const url = this.backgroundImageService.image().url;
    return url ? `url(${url})` : 'none';
  });

  ngOnInit(): void {
    this.idleReloadService.start();
  }
}
