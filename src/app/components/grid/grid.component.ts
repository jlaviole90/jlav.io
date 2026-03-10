import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

interface GridBox {
    el: HTMLElement;
    dx: number;
    dy: number;
    rot: number;
}

@Component({
    selector: 'app-grid',
    imports: [],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class GridComponent implements AfterViewInit {
    @ViewChild('grid', { static: true }) gridRef!: ElementRef<HTMLDivElement>;

    private readonly boxes: GridBox[] = [];

    ngAfterViewInit(): void {
        this.populate();
    }

    setProgress(progress: number): void {
        const eased = progress * progress;
        for (const box of this.boxes) {
            box.el.style.transform =
                `translate3d(${box.dx * eased}px, ${box.dy * eased}px, 0) rotate(${box.rot * eased}deg)`;
            box.el.style.opacity = String(Math.max(1 - progress * 1.8, 0));
        }
    }

    private populate(): void {
        const grid = this.gridRef.nativeElement;
        const cols = 22;
        const rows = 10;
        const centerCol = (cols - 1) / 2;
        const centerRow = (rows - 1) / 2;
        const indices: number[] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const box = document.createElement('div');
                box.className = 'grid-box';
                grid.appendChild(box);

                const dirX = col - centerCol + (Math.random() - 0.5) * 4;
                const dirY = row - centerRow + (Math.random() - 0.5) * 4;
                const dist = 400 + Math.random() * 600;
                const angle = Math.atan2(dirY, dirX);

                this.boxes.push({
                    el: box,
                    dx: Math.cos(angle) * dist,
                    dy: Math.sin(angle) * dist,
                    rot: (Math.random() - 0.5) * 540,
                });
                indices.push(this.boxes.length - 1);
            }
        }

        this.shuffle(indices);
        indices.forEach((idx, i) => {
            setTimeout(() => {
                this.boxes[idx].el.classList.add('visible');
            }, i * 10);
        });
    }

    private shuffle(arr: number[]): void {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}
