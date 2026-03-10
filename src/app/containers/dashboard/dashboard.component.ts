import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface CodeToken {
    text: string;
    cls: string;
    link?: string;
    route?: string;
    hoverKey?: string;
}

interface TypedToken {
    typed: string;
    full: string;
    cls: string;
    originalCls: string;
    link?: string;
    route?: string;
    hoverKey?: string;
}

const RETURN_LINE = 14;
const RETURN_TOKEN = 1;

const CODE: CodeToken[][] = [
    [
        { text: 'package ', cls: 'keyword' },
        { text: 'dashboard', cls: 'identifier' },
    ],
    [],
    [
        { text: 'const', cls: 'keyword' },
        { text: ' (', cls: '' },
    ],
    [
        { text: '    GitHub_URL   ', cls: 'const', link: 'https://github.com/jlaviole90' },
        { text: 'string ', cls: 'type' },
        { text: '=', cls: '' },
    ],
    [
        { text: '        "https://github.com/jlaviole90"', cls: 'string', link: 'https://github.com/jlaviole90' },
    ],
    [
        { text: '    LinkedIn_URL ', cls: 'const', link: 'https://www.linkedin.com/in/joshualaviolette/' },
        { text: 'string ', cls: 'type' },
        { text: '=', cls: '' },
    ],
    [
        { text: '        "linkedin.com/in/joshualaviolette"', cls: 'string', link: 'https://www.linkedin.com/in/joshualaviolette/' },
    ],
    [
        { text: ')', cls: '' },
    ],
    [],
    [
        { text: 'func ', cls: 'keyword' },
        { text: '(', cls: '' },
        { text: 'w ', cls: 'var' },
        { text: '*', cls: '' },
        { text: 'Website', cls: 'type' },
        { text: ') ', cls: '' },
        { text: 'Navigate', cls: 'func' },
        { text: '() (*', cls: '' },
        { text: 'WebPage', cls: 'type' },
        { text: ') {', cls: '' },
    ],
    [
        { text: '    about ', cls: 'var', route: '/about', hoverKey: 'about' },
        { text: ':= ', cls: '' },
        { text: 'w', cls: 'var' },
        { text: '.', cls: '' },
        { text: 'About', cls: 'identifier', route: '/about', hoverKey: 'about' },
    ],
    [
        { text: '    projects ', cls: 'var', route: '/projects', hoverKey: 'projects' },
        { text: ':= ', cls: '' },
        { text: 'w', cls: 'var' },
        { text: '.', cls: '' },
        { text: 'Projects', cls: 'identifier', route: '/projects', hoverKey: 'projects' },
    ],
    [
        { text: '    resume ', cls: 'var', route: '/resume', hoverKey: 'resume' },
        { text: ':= ', cls: '' },
        { text: 'w', cls: 'var' },
        { text: '.', cls: '' },
        { text: 'Resume', cls: 'identifier', route: '/resume', hoverKey: 'resume' },
    ],
    [],
    [
        { text: '    return ', cls: 'keyword' },
        { text: 'nil', cls: 'const' },
    ],
    [
        { text: '}', cls: '' },
    ],
];

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    lines: TypedToken[][] = [];
    currentLine = 0;
    isTyping = true;
    hoveredKey = '';
    isMaximized = false;
    isMinimizing = false;

    private currentToken = 0;
    private currentChar = 0;
    private typeTimer: ReturnType<typeof setTimeout> | null = null;
    private fastForward = false;
    private skipCharDelay = 1;

    constructor(private readonly router: Router) {}

    ngOnInit(): void {
        this.lines.push(this.createTypedLine(0));
        this.typeNext();
    }

    ngOnDestroy(): void {
        if (this.typeTimer) clearTimeout(this.typeTimer);
    }

    get cursorLine(): number {
        return Math.min(this.currentLine, this.lines.length - 1);
    }

    isNavLine(lineIdx: number): boolean {
        return CODE[lineIdx]?.some(t => !!t.route) ?? false;
    }

    isLinkLine(lineIdx: number): boolean {
        return CODE[lineIdx]?.some(t => !!t.link) ?? false;
    }

    isLineReady(lineIdx: number): boolean {
        return !this.isTyping || lineIdx < this.currentLine;
    }

    onLineHover(lineIdx: number): void {
        if (!this.isLineReady(lineIdx)) return;
        const hoverToken = CODE[lineIdx]?.find(t => t.hoverKey);
        if (hoverToken?.hoverKey) {
            this.hoveredKey = hoverToken.hoverKey;
            this.updateReturnValue();
        }
    }

    onLineLeave(): void {
        this.hoveredKey = '';
        this.updateReturnValue();
    }

    skipTyping(): void {
        if (!this.isTyping || this.fastForward) return;
        this.fastForward = true;

        let remaining = 0;
        for (let l = this.currentLine; l < CODE.length; l++) {
            const startToken = l === this.currentLine ? this.currentToken : 0;
            for (let t = startToken; t < CODE[l].length; t++) {
                const done = (l === this.currentLine && t === this.currentToken) ? this.currentChar : 0;
                remaining += CODE[l][t].text.length - done;
            }
        }
        this.skipCharDelay = Math.max(Math.floor(500 / Math.max(remaining, 1)), 1);

        if (this.typeTimer) clearTimeout(this.typeTimer);
        this.typeNext();
    }

    onClose(): void {
        this.router.navigate(['/']);
    }

    onMinimize(): void {
        this.isMinimizing = true;
        setTimeout(() => this.router.navigate(['/about']), 400);
    }

    onMaximize(): void {
        this.isMaximized = !this.isMaximized;
    }

    onLineClick(lineIdx: number): void {
        if (!this.isLineReady(lineIdx)) return;
        const routeToken = CODE[lineIdx]?.find(t => t.route);
        if (routeToken?.route) {
            this.router.navigate([routeToken.route]);
        }
    }

    private updateReturnValue(): void {
        const token = this.lines[RETURN_LINE]?.[RETURN_TOKEN];
        if (!token || token.typed !== token.full) return;

        if (this.hoveredKey) {
            token.typed = this.hoveredKey;
            token.cls = 'var';
        } else {
            token.typed = token.full;
            token.cls = token.originalCls;
        }
    }

    private typeNext(): void {
        if (this.currentLine >= CODE.length) {
            this.isTyping = false;
            return;
        }

        const codeLineTokens = CODE[this.currentLine];

        if (codeLineTokens.length === 0 || this.currentToken >= codeLineTokens.length) {
            this.currentLine++;
            this.currentToken = 0;
            this.currentChar = 0;
            if (this.currentLine < CODE.length) {
                this.lines.push(this.createTypedLine(this.currentLine));
                const pause = this.fastForward
                    ? this.skipCharDelay
                    : CODE[this.currentLine].length === 0
                        ? this.rand(80, 150)
                        : this.rand(40, 100);
                this.typeTimer = setTimeout(() => this.typeNext(), pause);
            } else {
                this.isTyping = false;
            }
            return;
        }

        const typedToken = this.lines[this.currentLine][this.currentToken];
        this.currentChar++;
        typedToken.typed = typedToken.full.substring(0, this.currentChar);

        if (this.currentChar >= typedToken.full.length) {
            this.currentToken++;
            this.currentChar = 0;
            this.typeTimer = setTimeout(() => this.typeNext(), this.fastForward ? this.skipCharDelay : this.rand(8, 25));
        } else {
            this.typeTimer = setTimeout(
                () => this.typeNext(),
                this.fastForward ? this.skipCharDelay : this.charDelay(typedToken.full[this.currentChar - 1]),
            );
        }
    }

    private charDelay(char: string): number {
        if (char === ' ') return this.rand(15, 35);
        if ('{()}[]*'.includes(char)) return this.rand(40, 70);
        if ('.:;,='.includes(char)) return this.rand(30, 55);
        if (char === '"') return this.rand(35, 60);
        return this.rand(20, 50);
    }

    private rand(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    private createTypedLine(idx: number): TypedToken[] {
        return CODE[idx].map(t => ({
            typed: '',
            full: t.text,
            cls: t.cls,
            originalCls: t.cls,
            link: t.link,
            route: t.route,
            hoverKey: t.hoverKey,
        }));
    }
}
