import { Component, OnInit } from '@angular/core';
import {SidenavmenuComponent} from '../sidenavmenu.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(public side: SidenavmenuComponent) { }

  ngOnInit() {
    SidenavmenuComponent.EDIT_MODE = true;
    SidenavmenuComponent.PAN_MODE = false;
    SidenavmenuComponent.allowObjectSelect(0);
    console.log('Current mode: EDIT');
  }

// Function to update current canvas interaction mode (Edit or Pan mode)
  modeChanged(event) {
    console.log(event.value);

    switch (event.value) {
      case 'Edit':
        SidenavmenuComponent.EDIT_MODE = true;
        SidenavmenuComponent.PAN_MODE = false;
        SidenavmenuComponent.allowObjectSelect(0);
        console.log('Current mode: EDIT');
        break;
      case 'Pan':
        SidenavmenuComponent.EDIT_MODE = false;
        SidenavmenuComponent.PAN_MODE = true;
        SidenavmenuComponent.allowObjectSelect(1);
        console.log('Current mode: PAN');
        break;
      default:
        console.log('Error: Invalid Mode Value (' + event.value + ') - toolbar.component.ts : Line 26');
        break;
    }
  }

// Function to update zoom level
  zoomChanged(option) {
    SidenavmenuComponent.zoomView(option);
  }

// Creates svg file for printing/saving as pdf
  printSVG() {
    this.side.testSVG();
  }

  saveJ() {
    this.side.saveJson();
  }
}
