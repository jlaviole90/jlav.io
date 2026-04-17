import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent, WEBALYTICS_DASHBOARD_CONFIG } from '@jlaviole90/dashboard-angular';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [DashboardComponent],
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent {
    private router = inject(Router);
    readonly configured = !!inject(WEBALYTICS_DASHBOARD_CONFIG, { optional: true });

    navigate(path: string): void {
        this.router.navigate([path]);
    }
}
