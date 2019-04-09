import { Component, OnInit } from '@angular/core';
import {SidenavmenuComponent} from '../sidenavmenu/sidenavmenu.component';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { ImageModel } from 'src/app/admin/image.model';
import { ImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'app-floorplancard',
  templateUrl: './floorplan_card.component.html',
  styleUrls: ['./floorplan_card.component.scss']
})
export class FloorplancardComponent implements OnInit {

  itemList: ImageModel[];

  constructor(private db: AngularFireDatabase,
              private image: ImageService) { }

  ngOnInit() {
    let data = this.image.getLinks();
    data.snapshotChanges().subscribe(item => {
      this.itemList = [];

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.itemList.push(json as ImageModel);
      });
    });
    
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
