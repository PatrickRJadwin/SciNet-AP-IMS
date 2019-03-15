import { Component, OnInit } from '@angular/core';
import {fabric} from 'fabric';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenavmenu.component.html',
  styleUrls: ['./sidenavmenu.component.scss']
})
export class SidenavmenuComponent implements OnInit {

  constructor() { }

  canvas: any;

  ngOnInit() {
    this.canvas = new fabric.Canvas('myCanvas');
    this.canvas.add(new fabric.IText('Test'));
  }

}
