import { Injectable } from '@angular/core';
import { FirebaseApp} from 'angularfire2';
import { Image } from '../../plotting/sidenavmenu/image.model';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  image: Image;
  itemList: AngularFireList<any>

  constructor(private db: AngularFireDatabase,
              private firebase: FirebaseApp) { 
                this.itemList = db.list('images');
              }

  addImage(image: Image) {
    this.itemList.push(image);
  }

  getImage() {
    return this.itemList;
  }
}
