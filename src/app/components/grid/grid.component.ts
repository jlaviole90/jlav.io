import {
    animate,
    AnimationBuilder,
    AnimationPlayer,
    AnimationStyleMetadata,
    keyframes,
    style,
} from '@angular/animations';
import {
    AfterContentInit,
    Component,
    Renderer2,
    RendererFactory2
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-grid',
    imports: [],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss',
    animations: [],
})
export class GridComponent implements AfterContentInit {
    private renderer: Renderer2;
    private boxSpin: AnimationPlayer[] = [];
    private boxTranslate: AnimationPlayer[] = [];

    constructor(
        private rendererFactory: RendererFactory2,
        private builder: AnimationBuilder,
        private router: Router,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    public ngAfterContentInit(): void {
        this.populate();
    }

    public activate(is: boolean) {
        if (is) {
            this.builder
                .build([
                    animate(
                        '5s',
                        keyframes([
                            style({ transform: 'perspective(1000px)' }),
                        ]),
                    ),
                ])
                .create(document.getElementById('grid-container'))
                .play();

            this.builder
                .build([animate('1s', keyframes([style({ opacity: 0 })]))])
                .create(document.getElementById('hero-title'))
                .play();

            this.boxSpin.forEach((box) => {
                box.play();
            });
            this.boxTranslate.forEach((box) => {
                box.play();
            });
            setTimeout(() => this.router.navigate(['/dashboard']), 4000);
        }
    }

    private populate() {
        let list: string[] = [];

        let i = 0;
        while (i++ < 22) {
            // generate 3 random numbers to determine spin velocity
            // each number represents the increment in rotational position
            let j = 0;
            while (j++ < 10) {
                let v1 = Math.random() * 10;
                let v2 = Math.random() * 10;
                let v3 = Math.random() * 10;
                let cV1 =
                    i < 11 ? Math.random() * -10000 : Math.random() * 10000;
                let cV2 = Math.random() * -10000;
                let x = 0;
                let y = 0;
                let dXv = 50;
                let dYv = 0;
                let dZv = 0;
                let xTog =
                    v1 > 0.5
                        ? () => {
                              return (dXv += v2);
                          }
                        : () => {
                              return (dXv -= v2);
                          };
                let zTog =
                    v2 > 0.5
                        ? () => {
                              return (dZv += v3);
                          }
                        : () => {
                              return (dZv -= v3);
                          };
                let yTog =
                    v3 > 0.5
                        ? () => {
                              return (dYv += v1);
                          }
                        : () => {
                              return (dYv -= v1);
                          };

                let sv = 1;
                let ss = 0.0005;
                let boxAnim: AnimationStyleMetadata[] = [];
                let k = 0;
                while (k++ < 100) {
                    boxAnim.push(
                        style({
                            transform:
                                `rotateX(${xTog()}deg) rotateY(${yTog()}deg) rotateZ(${zTog()}deg) ` +
                                `scale3d(${sv >= 0.5 ? (sv -= ss) : 0.5}, ${sv >= 0.5 ? (sv -= ss) : 0.5}, ${sv >= 0.5 ? (sv -= ss) : 0.5})`,
                            //,
                        }),
                    );
                }
                let boxId =
                    String.fromCharCode(97 + i) +
                    '-box-' +
                    String.fromCharCode(97 + j);
                const boxBox = this.createElement('', 'div', 'grid-box-box');
                const box = this.createElement(boxId, 'div', 'grid-box');
                this.renderer.appendChild(boxBox, box);
                this.renderer.appendChild(
                    document.getElementById('grid-container'),
                    boxBox,
                );
                this.boxTranslate.push(
                    this.builder
                        .build([
                            animate(
                                '5s',
                                keyframes([
                                    style({
                                        transform: `translate3d(${cV1}px, ${cV2}px, ${0}px)`,
                                        opacity: 0
                                    }),
                                ]),
                            ),
                        ])
                        .create(boxBox),
                );
                this.boxSpin.push(
                    this.builder
                        .build([animate('10s', keyframes(boxAnim))])
                        .create(box),
                );

                list.push(boxId);
            }
        }

        // Shuffle the list so boxes appear in random order
        list = this.shuffle(list);
        this.spawn(list);
    }

    private createElement(id: string, type: string, clazz?: string): any {
        const el = this.renderer.createElement(type);
        this.renderer.setProperty(el, 'id', id);

        if (!!clazz) {
            this.renderer.addClass(el, clazz);
        }

        return el;
    }

    private shuffle(arr: any[]): any[] {
        let i = arr.length;

        while (i != 0) {
            let rIdx = Math.floor(Math.random() * i);
            i--;

            [arr[i], arr[rIdx]] = [arr[rIdx], arr[i]];
        }
        return arr;
    }

    private spawn(list: string[]) {
        setTimeout(() => {
            const boxId = list.pop();
            if (!boxId) return;
            const box = document.getElementById(boxId);
            this.renderer.addClass(box, 'grid-box-transition');
            this.spawn(list);
        }, 10);
    }
}
