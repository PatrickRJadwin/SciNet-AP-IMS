import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../inventory/inventory.model';
import { SnackbarService } from '../shared/snackbar.service';
import { AuthenticationService } from '../shared/services/authentication.service';


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {

  item = new Item("","","","","user",false,false,false);
  add = new Item("","","","","user",true,true,true);

  public tf: boolean;

  constructor(public dialogRef: MatDialogRef<AdditemComponent>,
              public inventoryService: InventoryService,
              public snack: SnackbarService,
              public auth: AuthenticationService) { }

  public closeMe() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  //Need to add logged in user's name for created_by field
  addItem() {

    if(this.auth.isUser() == false) {
      this.snack.openSnackBar('You do not have permissions for this', 2000);
    }
    else {
      const user = this.auth.getUser();
      this.item.created_by = user.displayName;
      this.item.mac = this.add.mac;
      this.item.location = this.add.location;
      this.item.port = this.add.port;
      this.item.created_at = new Date().toISOString();

      this.inventoryService.addItem(this.item);
      this.dialogRef.close();
    };
  }

}

