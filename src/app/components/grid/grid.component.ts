import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {

  constructor() {}

  @Input()
  public set activate(is: boolean) {
    // TODO: initiate animation
  }

}
