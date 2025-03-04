import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TypewriterService } from '../../services/typewriter.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
    githubLink: string = 'https://github.com/jlaviole90';
    linkedinLink: string = 'https://www.linkedin.com/in/joshualaviolette/';

    hoveredVar: string = 'nil';

    tokenContainer: HTMLCollectionOf<Element>;

    globalIdx: number = 0;

    tokens$: Observable<string>[] = [];

    private typewriter: TypewriterService = inject(TypewriterService);

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.tokenContainer = document.getElementsByClassName('token');
        this.type(0);
    }

    public get idx(): number {
        return this.globalIdx++;
    }

    public igi(): void {
        this.globalIdx += 1;
    }

    public navigate(path: string): void {
        console.log(path);
        this.router.navigate([path]);
    }

    // Is this as awful as I think it is?
    private type(x: number) {
        let cntnt = TEMPLATE_CONTENT[x];
        if (cntnt === '\"{{ githubLink }}\"') cntnt = this.githubLink;
        else if (cntnt === '\"{{ linkedinLink }}\"') cntnt = this.linkedinLink;

        let el = this.tokenContainer[x];
        if (!el) return;
        this.tokens$[x] = this.typewriter.type(cntnt, 20);
        this.tokens$[x].subscribe((text) => {
            if (text.length === cntnt.length) {
                el.innerHTML = text;
                this.type(x + 1);
            }
        });
    }
}

const TEMPLATE_CONTENT: string[] = [
    'package ',
    'dashboard',
    'const',
    ' (',
    'GitHub_URL ',
    ' string ',
    '= ',
    '"{{ githubLink }}"',
    'LinkedIn_URL ',
    'string ',
    '= ',
    '"{{ linkedinLink }}"',
    ')',
    'func ',
    '(',
    'w ',
    '*',
    'Website',
    ') ',
    'Navigate',
    '() (*',
    'WebPage',
    ') {',
    'about ',
    ':= ',
    'w',
    '.',
    'About',
    'projects ',
    ':= ',
    'w',
    '.',
    'Projects',
    'resume ',
    ':= ',
    'w',
    '.',
    'Resume',
    'return ',
    'nil',
    '}',
];
