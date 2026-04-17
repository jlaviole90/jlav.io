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
    // Internal site UUID — used by the dashboard's authenticated read APIs.
    siteId: string;
    // Public `wb_live_*` id — safe to embed, used by the tracker/ingest.
    publicSiteId: string;
    // Origin-bound, read-only `wb_pub_live_*` token — used by the dashboard.
    publicToken: string;
}

const EMPTY_WEBALYTICS: WebalyticsRuntimeConfig = {
    host: '',
    siteId: '',
    publicSiteId: '',
    publicToken: '',
};

export function buildAppConfig(webalytics: WebalyticsRuntimeConfig | null): ApplicationConfig {
    const baseProviders = [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(),
        TypewriterService,
    ];

    const { host, siteId, publicSiteId, publicToken } = webalytics ?? EMPTY_WEBALYTICS;

    const webalyticsProviders =
        host && publicSiteId
            ? [provideWebalytics({ host, siteId: publicSiteId })]
            : [];

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
