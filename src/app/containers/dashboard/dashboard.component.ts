import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypewriterService } from '../../services/typewriter.service';
import { from, Observable, of, tap } from 'rxjs';

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

    text$: Observable<string>[] = [];

    private typewriter: TypewriterService = inject(TypewriterService);

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.type(0);
    }

    public navigate(path: string) {
        console.log(path);
        this.router.navigate([path]);
    }

    // Is this as awful as I think it is?
    private type(idx: number) {
        let cntnt = TEMPLATE_CONTENT[idx];
        if (cntnt === '\"{{ githubLink }}\"') cntnt = this.githubLink;
        else if (cntnt === '\"{{ linkedinLink }}\"') cntnt = this.linkedinLink;

        let el = document.getElementById(TEMPLATE_IDS[idx]);
        if (!el) return;
        this.text$[idx] = this.typewriter.typeEffect(cntnt);
        this.text$[idx].subscribe((text) => {
            if (text.length === cntnt.length) {
                el.innerHTML = text;
                this.type(idx + 1);
            }
        });
    }
}

const TEMPLATE_IDS: string[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
    'ag',
    'ah',
    'ai',
    'aj',
];

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
