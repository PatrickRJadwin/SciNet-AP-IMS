import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef, MatPaginator } from '@angular/material';
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
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
      this.dataSource.paginator = this.paginator;
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

  selectJoinedToggle(key: string) {
    this.selectedItem = this.itemList.filter(x => x.$key === key)[0];
    if (this.selectedItem.joined === true) {
      this.edit.joined = false;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.edit.joined, this.selectedItem.complete, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
    else {
      this.edit.joined = true;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.edit.joined, this.selectedItem.complete, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
  }

  selectCompleteToggle(key: string) {
    this.selectedItem = this.itemList.filter(x => x.$key === key)[0];
    if (this.selectedItem.complete === true) {
      this.edit.complete = false;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.selectedItem.joined, this.edit.complete, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
    else {
      this.edit.joined = true;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.selectedItem.joined, true, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
  }

  onSave() {
    let editedItem = new Item(this.edit.mac, this.edit.location, this.edit.port, this.selectedItem.created_at,
      this.selectedItem.created_by, this.selectedItem.joined, this.selectedItem.complete, this.selectedItem.checkedIn);
    editedItem.lastUpdate = new Date().toString();

    this.inventoryService.editItem(this.selectedItem.$key, editedItem);
  }


    //Query functions for mat-select
  getJoined() {
    let data = this.inventoryService.getJoined();
    data.snapshotChanges().subscribe(item => {
        this.itemList = [];
  
      item.forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.itemList.push(json as Item);
        });
      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      });
    }
  
  getComplete() {
    let data = this.inventoryService.getCompleted();
    data.snapshotChanges().subscribe(item => {
        this.itemList = [];
  
      item.forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.itemList.push(json as Item);
        });
      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      });
    }

  getNotJoined() {
    let data = this.inventoryService.getNotJoined();
    data.snapshotChanges().subscribe(item => {
          this.itemList = [];
    
      item.forEach(element => {
            let json = element.payload.toJSON();
            json["$key"] = element.key;
            this.itemList.push(json as Item);
          });
        this.dataSource = new MatTableDataSource(this.itemList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        });
    }
  
  getJoinedNotCompleted() {
    let data = this.inventoryService.getJoinedNotCompleted();
    
    data.snapshotChanges().subscribe(item => {
          this.itemList = [];
    
      item.forEach(element => {
            let json = element.payload.toJSON();
            json["$key"] = element.key;
            this.itemList.push(json as Item);
          });
      this.itemList = this.itemList.filter(t=>t.joined === true);
      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      });
  }
}
