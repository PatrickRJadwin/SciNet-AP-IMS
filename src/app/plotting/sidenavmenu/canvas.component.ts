
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
  
}
