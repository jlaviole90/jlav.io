import { Routes } from '@angular/router';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { LandingComponent } from './containers/landing/landing.component';
import { ProjectsComponent } from './containers/projects/projects.component';
import { ResumeComponent } from './containers/resume/resume.component';
import { AboutComponent } from './containers/about/about.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: 'projects',
        component: ProjectsComponent,
    },
    {
        path: 'resume',
        component: ResumeComponent,
    },
    {
        path: '',
        component: LandingComponent,
    },
];
