
import {AfterViewInit, Component, Input} from '@angular/core';
import {fabric} from 'fabric';
import {fromEvent} from "rxjs";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenavmenu.component.html',
  styleUrls: ['./sidenavmenu.component.scss']
})
export class SidenavmenuComponent implements AfterViewInit {

  constructor() { }

  canvas: any;

  @Input() public fpWidth = window.screenX * .9;
  @Input() public fpHeight = 750;

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('myCanvas');

    this.canvas.setHeight(this.fpHeight);
    this.canvas.setWidth(this.fpWidth);
    this.captureEvents();
  }

  captureEvents() {
    const canvasRef = this.canvas;
    const rect = document.getElementById('myCanvas').getBoundingClientRect();

    canvasRef.on('mouse:down', function fun(options) {
      if (options.target) {
        console.log('an object was clicked! ', options.target.type);
      } else {
        console.log(options.e.clientX - rect.left, options.e.clientY);

        const imgElement = new Image();
        imgElement.src = 'https://i.imgur.com/Q5skAxA.png'; // Device Icon URL
        const imgInstance = new fabric.Image(imgElement, {
          left: options.e.clientX - (rect.left * 1.25),
          top: options.e.clientY - (rect.top * 1.2),
          scaleX: .2,
          scaleY: .2
        });
        canvasRef.add(imgInstance);
      }
    });
  }
}
