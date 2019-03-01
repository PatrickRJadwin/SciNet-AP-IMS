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
  selectedItem: Item;
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

  editItem(key: string, item: Item) {
    this.db.object('/items/' + key).update(item);
  }
}
