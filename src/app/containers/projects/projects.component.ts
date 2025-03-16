import { Component } from "@angular/core";
import { DisplayBoxComponent } from "../../components/display-box/display-box.component";

@Component({
    selector: "app-projects",
    templateUrl: "./projects.component.html",
    styleUrls: ["./projects.component.scss"],
    imports: [
        DisplayBoxComponent
    ]
})
export class ProjectsComponent {
    constructor() {}
}
