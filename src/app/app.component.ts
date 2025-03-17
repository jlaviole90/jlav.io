import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject } from "@vercel/analytics";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'jlav.io';

    constructor() {
        inject();
    }
}
