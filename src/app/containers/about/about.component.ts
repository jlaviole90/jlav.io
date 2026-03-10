import { Component } from '@angular/core';
import { Router } from '@angular/router';

type FlipState = 'front' | 'flipping-to-back' | 'back' | 'flipping-to-front';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
    flipState: FlipState = 'front';

    constructor(private readonly router: Router) {}

    get isBack(): boolean {
        return this.flipState === 'back' || this.flipState === 'flipping-to-front';
    }

    navigate(path: string): void {
        this.router.navigate([path]);
    }

    flip(): void {
        if (this.flipState === 'front') {
            this.flipState = 'flipping-to-back';
        } else if (this.flipState === 'back') {
            this.flipState = 'flipping-to-front';
        }
    }

    onFlipEnd(): void {
        if (this.flipState === 'flipping-to-back') {
            this.flipState = 'back';
        } else if (this.flipState === 'flipping-to-front') {
            this.flipState = 'front';
        }
    }
}
