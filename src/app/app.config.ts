import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { TypewriterService } from './services/typewriter.service';

export const appConfig: ApplicationConfig = {
  providers: [
        provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
        provideAnimations(),
        TypewriterService,
    ]
};
