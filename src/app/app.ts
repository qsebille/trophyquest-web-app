import {Component, computed, inject} from '@angular/core';
import {NavbarComponent} from '@core/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
import {IdleReloadService} from "@core/utils/idle-reload.service";
import {BackgroundImageService} from "@core/background/background-image.service";
import {Notification} from '@shared/notification/notification.component';

@Component({
  selector: 'tq-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    Notification,

  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly backgroundImageService = inject(BackgroundImageService);
  private readonly idleReloadService = inject(IdleReloadService);

  readonly backgroundUrl = computed(() => {
    const url = this.backgroundImageService.backgroundImage().url;
    return url ? `url(${url})` : 'none';
  });

  ngOnInit(): void {
    this.idleReloadService.start();
  }
}
