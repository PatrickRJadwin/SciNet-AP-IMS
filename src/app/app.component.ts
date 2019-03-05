import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inventories: any[]
  constructor(
    db: AngularFireDatabase,
    public authService: AuthService
  ) {
    db.list('/items').valueChanges()
      .subscribe(inventories => {
        this.inventories = inventories;
      });
  }
}
