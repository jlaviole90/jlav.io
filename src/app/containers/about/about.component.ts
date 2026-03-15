import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
    constructor(private readonly router: Router) {}

    navigate(path: string): void {
        this.router.navigate([path]);
    }
}
