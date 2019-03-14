import { Component, OnInit } from '@angular/core';

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
    // el.innerHTML
  }

}
