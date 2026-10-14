import {Injectable, signal} from '@angular/core';
import {BackgroundImageResponse} from "./models/background-image-response.model";

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private readonly _image = signal<BackgroundImageResponse>({url: ''});

  readonly image = this._image.asReadonly();

  setBackground(response: BackgroundImageResponse) {
    this._image.set(response);
  }
}
