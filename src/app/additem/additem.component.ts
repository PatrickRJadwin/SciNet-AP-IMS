import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../inventory/inventory.model';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {

  item = new Item("","","","","user",true,true,true);
  add = new Item("","","","","user",true,true,true);

  constructor(public dialogRef: MatDialogRef<AdditemComponent>, public inventoryService: InventoryService) { }

  public closeMe() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  //Need to add logged in user's name for created_by field
  addItem() {
    this.item.mac = this.add.mac;
    this.item.location = this.add.location;
    this.item.port = this.add.port;
    this.item.created_at = new Date().toString();
    this.inventoryService.addItem(this.item);
    this.dialogRef.close();
  }

}
