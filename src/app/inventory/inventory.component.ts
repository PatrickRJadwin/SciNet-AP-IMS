import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { AdditemComponent } from '../additem/additem.component';
import { InventoryService } from './inventory.service';
import { Item } from './inventory.model';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  // Columns for table
  displayedColumns: string[] = ['seqNo', 'mac', 'location', 'port', 'created_at', 'created_by', 'joined', 'complete', 'edit', 'trash', 'key'];
  // Datasource var, will replace with db data

  itemList: Item[];
  selectedItem: Item;

  //edit data
  edit = new Item("","","","","",true,true,true);

  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog, private inventoryService: InventoryService) {
    inventoryService.getAllItems();
  }

  //Additem dialog open
  openDialog(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //Edit item dialog
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
    });
  }

  //initializing data
  ngOnInit() {
    let data = this.inventoryService.getAllItems();
    data.snapshotChanges().subscribe(item => {
      this.itemList = [];

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.itemList.push(json as Item);
      });
      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.sort = this.sort;
    });
  }

  //Delete/Edit functions
  onDelete(key: string) {
    this.inventoryService.deletebyKey(key);
  }

  
  selectItem(key: string, modal: string) {
    this.selectedItem = this.itemList.filter(x => x.$key === key)[0];
    this.edit.mac = this.selectedItem.mac;
    this.edit.location = this.selectedItem.location;
    this.edit.port = this.selectedItem.port;
    this.openModal(modal);
    console.log(this.selectedItem);
    console.log(this.edit);
  }


  onSave() {
    let editedItem = new Item(this.edit.mac, this.edit.location, this.edit.port, this.selectedItem.created_at,
      this.selectedItem.created_by, this.selectedItem.joined, this.selectedItem.complete, this.selectedItem.checkedIn);
    editedItem.lastUpdate = new Date().toString();

    this.inventoryService.editItem(this.selectedItem.$key, editedItem);
  }

}
