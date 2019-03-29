import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../inventory/inventory.model';
import { SnackbarService } from '../shared/snackbar.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {

  item = new Item("","","","","user",true,true,true);
  add = new Item("","","","","user",true,true,true);

  public tf: boolean;

  constructor(public dialogRef: MatDialogRef<AdditemComponent>,
              public inventoryService: InventoryService,
              public snack: SnackbarService,
              public auth: AuthenticationService,
              private afAuth: AngularFireAuth,
              private db: AngularFireDatabase) { }

  public closeMe() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  //Need to add logged in user's name for created_by field
  addItem() {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
    .child('user').once('value').then(snapshot => {
      this.tf = snapshot.val();
      console.log(this.tf);
    })

    if(this.tf === false) {
      this.snack.openSnackBar('You do not have permissions for this', 2000);
    }
    else if(this.tf === true) {
    const user = this.auth.getUser();
    this.item.created_by = user.displayName;
    this.item.mac = this.add.mac;
    this.item.location = this.add.location;
    this.item.port = this.add.port;
    this.item.created_at = new Date().toString();
    this.inventoryService.addItem(this.item);
    this.dialogRef.close();
    };
  }

}
