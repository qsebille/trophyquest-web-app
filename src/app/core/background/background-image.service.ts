import {inject, Injectable, signal} from '@angular/core';
import {BackgroundImageResponse} from "./models/background-image-response.model";
import {Observable} from "rxjs";
import {BackgroundImageApiService} from "./background-image-api.service";
import {NotificationService} from '@shared/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class BackgroundImageService {
  private readonly backgroundImageApiService = inject(BackgroundImageApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly _backgroundImage = signal<BackgroundImageResponse>({url: ''});

  readonly backgroundImage = this._backgroundImage.asReadonly();

  useTopPlayedGame(): void {
    this.replaceBackground(this.backgroundImageApiService.fetchForHome())
  }

  private replaceBackground(gameCoverImageObservable: Observable<BackgroundImageResponse>) {
    gameCoverImageObservable
      .subscribe({
        next: url => this._backgroundImage.set(url),
        error: (err) => {
          console.error("Failed to fetch background", err);
          this.notificationService.notifyError("Failed to fetch background")
        }
      })
  }
}
