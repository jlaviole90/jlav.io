import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-resume',
    templateUrl: './resume.component.html',
    styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent {
    constructor(private readonly router: Router) {}

    navigate(path: string): void {
        this.router.navigate([path]);
    }
}
