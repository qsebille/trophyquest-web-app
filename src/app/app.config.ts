import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withInMemoryScrolling} from '@angular/router';

import {routes} from '@core/routing/app.routes';
import {provideHttpClient, withInterceptors, withXhr} from '@angular/common/http';
import {provideAnimations} from "@angular/platform-browser/animations";
import {authInterceptor} from '@core/auth/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimations(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withComponentInputBinding(),
    ),
    provideHttpClient(
      withXhr(),
      withInterceptors([authInterceptor])
    ),
  ]
};
