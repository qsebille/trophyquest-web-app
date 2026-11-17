import {DOCUMENT, inject, Service, signal} from '@angular/core';
import {BackgroundImageResponse} from './models/background-image-response.model';

export const DEFAULT_BACKGROUND_URL = 'assets/images/default-background.svg';

const DEFAULT_BACKGROUND = {url: DEFAULT_BACKGROUND_URL};

@Service()
export class BackgroundService {
  private readonly document = inject(DOCUMENT);
  private readonly _image = signal<Readonly<{url: string}>>(DEFAULT_BACKGROUND);

  readonly image = this._image.asReadonly();

  setBackground(background: BackgroundImageResponse | null): void {
    const url = typeof background?.url === 'string' ? background.url.trim() : '';
    this._image.set(this.isValidUrl(url) ? {url} : DEFAULT_BACKGROUND);
  }

  private isValidUrl(url: string): boolean {
    if (!url || /[\s\\]/.test(url) || /^https?:(?!\/\/[^/])/i.test(url)) {
      return false;
    }

    try {
      const {protocol} = new URL(url, this.document.baseURI);
      return protocol === 'https:' || protocol === 'http:';
    } catch {
      return false;
    }
  }
}
