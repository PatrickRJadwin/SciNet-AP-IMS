import { Component, OnInit } from '@angular/core';
import {SidenavmenuComponent} from '../sidenavmenu/sidenavmenu.component';

@Component({
  selector: 'app-floorplancard',
  templateUrl: './floorplan_card.component.html',
  styleUrls: ['./floorplan_card.component.scss']
})
export class FloorplancardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  floorplanClicked(el) {
    console.log(el.src + ' ' + el.id);

    let fpImage;
    let fpName;

    fpImage = el.src;
    fpName = el.id;

    SidenavmenuComponent.loadFloorplan(fpImage, fpName);
  }

}
