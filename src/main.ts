import { bootstrapApplication } from '@angular/platform-browser';
import { buildAppConfig, WebalyticsRuntimeConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Fetch runtime config (Webalytics host/siteId/publicToken) from the Vercel
// serverless function before bootstrapping. Short timeout + graceful fallback
// so a dead/misconfigured endpoint never blocks app startup — the tracker
// and analytics dashboard just stay disabled in that case.
async function loadWebalyticsConfig(): Promise<WebalyticsRuntimeConfig | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    try {
        const res = await fetch('/api/webalytics-config', { signal: controller.signal });
        if (!res.ok) return null;
        const data = (await res.json()) as Partial<WebalyticsRuntimeConfig>;
        if (!data.host) return null;
        return {
            host: data.host,
            siteId: data.siteId ?? '',
            publicSiteId: data.publicSiteId ?? '',
            publicToken: data.publicToken ?? '',
        };
    } catch {
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

loadWebalyticsConfig().then((webalytics) =>
    bootstrapApplication(AppComponent, buildAppConfig(webalytics)).catch((err) =>
        console.error(err),
    ),
);
