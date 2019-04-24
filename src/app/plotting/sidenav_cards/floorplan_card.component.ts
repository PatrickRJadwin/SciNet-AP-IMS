import { Component, OnInit } from '@angular/core';
import {SidenavmenuComponent} from '../sidenavmenu/sidenavmenu.component';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { ImageModel } from 'src/app/shared/image.model';
import { ImageService } from 'src/app/shared/services/image.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { element } from '@angular/core/src/render3';
import {Img} from 'src/app/shared/services/img.model';

@Component({
  selector: 'app-floorplancard',
  templateUrl: './floorplan_card.component.html',
  styleUrls: ['./floorplan_card.component.scss']
})
export class FloorplancardComponent implements OnInit {

  itemList: ImageModel[];
  imgList: Img[];
  imgfire: AngularFireList<any>;


  constructor(private db: AngularFireDatabase,
              private image: ImageService,
              private auth: AuthenticationService) { 
              }

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

    this.imgfire = this.db.list('floorplanJson');
    let data2 = this.imgfire;
    data2.snapshotChanges().subscribe(item => {
      this.imgList = [];

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.imgList.push(json as Img);
      });
    });
    
  }

  deleteFp(key: string) {
    const url = this.itemList.filter(x => x.$key == key)[0].url;

    if (this.imgList.filter(x=>x.url == url).length > 0) {
      let keyjson = this.imgList.filter(x => x.url == url)[0].$key;
      this.imgfire.remove(keyjson);
    }
    
    this.image.deleteByKey(key)
  }

  floorplanClicked(el) {
    let fpImage;
    let fpName;

    fpImage = el.src;
    fpName = el.id;

    SidenavmenuComponent.loadFloorplan(fpImage, fpName);
  }

}
