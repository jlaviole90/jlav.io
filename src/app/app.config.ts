import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { TypewriterService } from './services/typewriter.service';
import { provideWebalytics } from '@jlaviole90/tracker-angular';
import { provideWebalyticsDashboard } from '@jlaviole90/dashboard-angular';
import { environment } from '../environments/environment';

const baseProviders = [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    TypewriterService,
];

const { siteId, host, publicToken } = environment.webalytics;
const webalyticsProviders =
    siteId && host
        ? [
              provideWebalytics({
                  host,
                  siteId,
              }),
          ]
        : [];

const webalyticsDashboardProviders =
    host && publicToken && siteId
        ? [
              provideWebalyticsDashboard({
                  kind: 'public',
                  host,
                  publicToken,
                  siteId,
              }),
          ]
        : [];

export const appConfig: ApplicationConfig = {
    providers: [
        ...baseProviders,
        ...webalyticsProviders,
        ...webalyticsDashboardProviders,
    ],
};
