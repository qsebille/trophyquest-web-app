import {Service, signal} from '@angular/core';
import {BackgroundImageResponse} from "./models/background-image-response.model";

@Service()
export class BackgroundService {
  private readonly _image = signal<BackgroundImageResponse>({url: ''});

  readonly image = this._image.asReadonly();

  setBackground(background: BackgroundImageResponse | null): void {
    if (null == background) {
      this._image.set({url: ''});
      return;
    }
    this._image.set(background);
  }
}
