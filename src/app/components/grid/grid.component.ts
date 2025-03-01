import { AfterContentInit, Component, Input, Renderer2, RendererFactory2 } from '@angular/core';

@Component({
    selector: 'app-grid',
    imports: [],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss'
})
export class GridComponent implements AfterContentInit {

  private renderer: Renderer2

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public ngAfterContentInit(): void {
    this.populate();
  }

  @Input()
  public set activate(is: boolean) {
    // TODO: initiate animation
  }

  private populate() {

    let list: string[] = [];

    let i = 0;
    while (i < 22) {
      let containerId = 'col-' + i;
      const container = this.createElement(containerId, 'span', 'box-col');

      let j = 0;
      while (j < 10) {
        let boxId = i + '-box-' + j++;
        const box = this.createElement(boxId, 'div', 'grid-box');

        this.renderer.appendChild(container, box);

        list.push(boxId);
      }
      i++;
      this.renderer.appendChild(document.getElementById('grid-container'), container);
    }

    console.log(list);
    list = this.shuffle(list);
    console.log(list);
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

