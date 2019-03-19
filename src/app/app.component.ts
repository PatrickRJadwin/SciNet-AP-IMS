import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inventories: any[]
  constructor(
    db: AngularFireDatabase,
    public auth: AuthenticationService
  ) {
    db.list('/items').valueChanges()
      .subscribe(inventories => {
        this.inventories = inventories;
      });
  }
}
