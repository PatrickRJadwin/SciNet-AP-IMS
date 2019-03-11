
import {
  Component, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-canvas',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { border: 3px solid #000; background-color: white; border-color: dimgrey; border-style: groove}']
})
export class CanvasComponent implements AfterViewInit {
  //  a reference to the canvas element from our template
  @ViewChild('canvas') public canvas: ElementRef;

  // setting a width and height for the canvas
  @Input() public width = 1000;
  @Input() public height = 600;

  private cx: CanvasRenderingContext2D;

  public ngAfterViewInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    // we'll implement this method to start capturing mouse events
    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .subscribe((click: MouseEvent) => {
        const rect = canvasEl.getBoundingClientRect();

        const currentPos = {
          x: click.clientX - (rect.left * 2),
          y: click.clientY - (rect.top * 2)
        };

        this.drawOnCanvas(currentPos);
      });
  }

  private drawOnCanvas(currentPos: { x: number, y: number }) {
    const smallIcon = [15, 85, 25];
    const mediumIcon = [28, 70, 50];
    const largeIcon = [50, 50, 100];

    const IconSize = smallIcon;

    const deviceIcon = new Image();
    deviceIcon.src = 'https://i.imgur.com/oUTwG7U.png';
    this.cx.drawImage(deviceIcon, (currentPos.x - IconSize[0]), (currentPos.y + IconSize[1]), IconSize[2], IconSize[2]);
  }
}
