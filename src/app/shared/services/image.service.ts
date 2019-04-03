import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { ImageModel } from 'src/app/admin/image.model';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  image: ImageModel;
  linkList: AngularFireList<any>

  constructor(private af: AngularFireStorage, private db: AngularFireDatabase) { 
    this.linkList = db.list('floorplans')
  }

  addLink(image: ImageModel) {
    this.linkList.push(image);
  }
}
