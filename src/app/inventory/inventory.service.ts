import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Item } from './inventory.model';
import { FirebaseApp} from 'angularfire2' ;
import 'firebase/storage';
 
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  item: Item;
  itemList: AngularFireList<any>;
  constructor(private db: AngularFireDatabase, private firebaseApp: FirebaseApp) {

    this.itemList = db.list('items');

  }

  getAllItems() {
    return this.itemList;
  }

  deletebyKey($key: string) {
    this.itemList.remove($key);
  }

  addItem(item: Item) {
    this.itemList.push(item);
  }
}
