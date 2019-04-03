import { Injectable } from '@angular/core';
import { AngularFireList } from 'angularfire2/database';
import { Image } from 'src/app/admin/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  image: Image;
  itemList: AngularFireList<any>

  constructor() { }

  addImage(image: Image) {
    this.itemList.push(image);
  }

  getImage() {
    return this.itemList;
  }
}
