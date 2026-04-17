import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { TypewriterService } from './services/typewriter.service';
import { provideWebalytics } from '@jlaviole90/tracker-angular';
import { provideWebalyticsDashboard } from '@jlaviole90/dashboard-angular';

export interface WebalyticsRuntimeConfig {
    host: string;
    siteId: string;
    publicToken: string;
}

export function buildAppConfig(
    webalytics: WebalyticsRuntimeConfig | null,
): ApplicationConfig {
    const baseProviders = [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(),
        TypewriterService,
    ];

    const { host, siteId, publicToken } = webalytics ?? {
        host: '',
        siteId: '',
        publicToken: '',
    };

    const webalyticsProviders =
        host && siteId ? [provideWebalytics({ host, siteId })] : [];

    const webalyticsDashboardProviders =
        host && siteId && publicToken
            ? [
                  provideWebalyticsDashboard({
                      kind: 'public',
                      host,
                      siteId,
                      publicToken,
                  }),
              ]
            : [];

    return {
        providers: [
            ...baseProviders,
            ...webalyticsProviders,
            ...webalyticsDashboardProviders,
        ],
    };
}
