import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent } from '../../components/grid/grid.component';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    imports: [GridComponent],
})
export class LandingComponent implements AfterViewInit, OnDestroy {
    @ViewChild('scrollContainer') scrollRef!: ElementRef<HTMLDivElement>;
    @ViewChild('heroTitle') titleRef!: ElementRef<HTMLHeadingElement>;
    @ViewChild('scrollIndicator') indicatorRef!: ElementRef<HTMLDivElement>;
    @ViewChild(GridComponent) grid!: GridComponent;

    private rafId: number | null = null;
    private hasNavigated = false;

    constructor(private readonly router: Router) {}

    ngAfterViewInit(): void {
        const el = this.scrollRef.nativeElement;
        el.scrollTop = 0;

        // Delay listener attachment — the browser may restore scroll position
        // asynchronously after the component mounts, which would immediately
        // trigger navigation back to /dashboard.
        setTimeout(() => {
            el.scrollTop = 0;
            this.grid.setProgress(0);
            this.titleRef.nativeElement.style.opacity = '1';
            this.indicatorRef.nativeElement.style.opacity = '1';
            el.addEventListener('scroll', this.onScroll, { passive: true });
        }, 50);
    }

    ngOnDestroy(): void {
        this.scrollRef.nativeElement.removeEventListener('scroll', this.onScroll);
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }
    }

    private readonly onScroll = (): void => {
        if (this.rafId !== null) return;
        this.rafId = requestAnimationFrame(() => {
            this.update();
            this.rafId = null;
        });
    };

    private update(): void {
        const el = this.scrollRef.nativeElement;
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll <= 0) return;

        const progress = Math.min(el.scrollTop / maxScroll, 1);

        this.titleRef.nativeElement.style.opacity = String(Math.max(1 - progress * 3, 0));
        this.indicatorRef.nativeElement.style.opacity = String(Math.max(1 - progress * 5, 0));

        this.grid.setProgress(progress);

        if (progress >= 0.95 && !this.hasNavigated) {
            this.hasNavigated = true;
            setTimeout(() => {
                this.router.navigate(['/dashboard'], { replaceUrl: true });
            }, 300);
        }
    }
}
