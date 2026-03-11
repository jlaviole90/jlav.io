import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Project {
    name: string;
    url: string;
    description: string | null;
    language: string | null;
    topics: string[];
    readme: string | null;
}

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
    imports: [CommonModule],
})
export class ProjectsComponent implements OnInit {
    projects: Project[] = [];
    loading = true;
    error = false;
    expandedIdx: number | null = null;

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
        private readonly sanitizer: DomSanitizer,
    ) {}

    ngOnInit(): void {
        this.http.get<Project[]>('/api/projects').subscribe({
            next: (data) => {
                this.projects = data;
                this.loading = false;
            },
            error: () => {
                this.error = true;
                this.loading = false;
            },
        });
    }

    navigate(path: string): void {
        this.router.navigate([path]);
    }

    toggleReadme(idx: number): void {
        this.expandedIdx = this.expandedIdx === idx ? null : idx;
    }

    getReadmeHtml(project: Project): SafeHtml | null {
        if (!project.readme) return null;
        return this.sanitizer.bypassSecurityTrustHtml(project.readme);
    }

    formatName(name: string): string {
        return name.replaceAll('-', ' ').replaceAll('_', ' ');
    }

    langColor(lang: string | null): string {
        const colors: Record<string, string> = {
            TypeScript: '#3178c6',
            JavaScript: '#f1e05a',
            Go: '#00add8',
            Python: '#3572a5',
            Rust: '#dea584',
            Java: '#b07219',
            HTML: '#e34c26',
            CSS: '#563d7c',
            Shell: '#89e051',
            Dockerfile: '#384d54',
        };
        return colors[lang ?? ''] ?? '#8b8b8b';
    }
}
