import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgxTypewriterComponent } from "@omnedia/ngx-typewriter";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    imports: [CommonModule, NgxTypewriterComponent]
})
export class DashboardComponent {
    githubLink: string = "https://github.com/jlaviole90";
    linkedinLink: string = "https://www.linkedin.com/in/joshualaviolette/";

    hoveredVar: string = "nil";

    quote: string = '\"';

    constructor(private router: Router) {}

    public navigate(path: string) {
        console.log(path);
        this.router.navigate([path]);
    }
}
