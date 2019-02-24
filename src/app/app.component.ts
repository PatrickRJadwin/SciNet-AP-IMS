import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SciNet Access Point Inventory';
  inventories: any[]
  constructor(db: AngularFireDatabase) {
    db.list('/items').valueChanges()
      .subscribe(inventories => {
        this.inventories = inventories;
        console.log(this.inventories);
      });
  }
}
