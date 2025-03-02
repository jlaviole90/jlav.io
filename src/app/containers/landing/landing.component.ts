import { Component } from "@angular/core";
import { GridComponent } from "../../components/grid/grid.component";

@Component({
    selector: "app-landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.scss"],
    imports: [
        GridComponent
    ]
})
export class LandingComponent {
    constructor() {}
}
