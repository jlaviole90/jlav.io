import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-display-box',
    templateUrl: './display-box.component.html',
    styleUrls: ['./display-box.component.scss']
})
export class DisplayBoxComponent {
    @Input() title: string;
    @Input() description: string;
    @Input() link: string;

    constructor() {}

    public navigateToLink() {
        window.open(this.link);
    }
}
