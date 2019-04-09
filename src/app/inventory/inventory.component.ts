import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef, MatPaginator, MatSlideToggleChange, MatCheckbox } from '@angular/material';
import { AdditemComponent } from '../additem/additem.component';
import { InventoryService } from './inventory.service';
import { Item } from './inventory.model';
import { User } from '../shared/services/user.model';
import { SnackbarService } from '../shared/snackbar.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  // Columns for table
  displayedColumns: string[] = ['seqNo', 'mac', 'location', 'port', 'created_at', 'created_by', 'joined', 'complete', 'edit', 'trash'];
  // Datasource var, will replace with db data

  itemList: Item[];
  selectedItem: Item;
 
  user: User;

  public tf: boolean;

  usertf: boolean;
  admintf: boolean;
  superusertf: boolean;

  //edit data
  edit = new Item("","","","","",true,true,true);

  setUpDown = "Setup";
  countAll: number;
  countJoined: number;
  countCompleted: number;
  countCheckedIn: number;
  show = true;
  selected: string;

  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog,
    private inventoryService: InventoryService,
    private snack: SnackbarService,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth) {
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
        width: '500px',
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
      this.countAll = this.itemList.length;
      this.countJoined = this.itemList.filter(x => x.joined === true).length;
      this.countCompleted = this.itemList.filter(x => x.complete === true).length;
      this.countCheckedIn = this.itemList.filter(x => x.checkedIn === true).length;
    });

  }

  //Delete/Edit functions
  onDelete(key: string) {

    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
    .child('superuser').once('value').then(snapshot => {
      this.tf = snapshot.val();
      console.log(this.tf);
    });

    if (this.tf) {
      this.inventoryService.deletebyKey(key);

    }
    else if (!!this.tf) {
      this.snack.openSnackBar('You do not have permission for this', 2000);
    }
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
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
    .child('admin').once('value').then(snapshot => {
      this.tf = snapshot.val();
      console.log(this.tf);
    })

    if (this.tf === true) {

    this.selectedItem = this.itemList.filter(x => x.$key === key)[0];

    if (this.selectedItem.joined === true) {
      this.edit.joined = false;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.edit.joined, this.selectedItem.complete, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toISOString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
    else {
      this.edit.joined = true;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.edit.joined, this.selectedItem.complete, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toISOString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    };
  }
  else if (this.tf === false) {
    this.snack.openSnackBar('You do not have permission for this.', 2000);
  };
    this.refreshAfterEdit();
  }

  selectCompleteToggle(key: string) {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
    .child('admin').once('value').then(snapshot => {
      this.tf = snapshot.val();
      console.log(this.tf);
    })

    if (this.tf === true) {

    this.selectedItem = this.itemList.filter(x => x.$key === key)[0];
    if (this.selectedItem.complete === true) {
      this.edit.complete = false;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.selectedItem.joined, this.edit.complete, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toISOString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
    else {
      this.edit.joined = true;
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.selectedItem.joined, true, this.selectedItem.checkedIn);
      editedItem.lastUpdate = new Date().toISOString();
  
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    };
  }
  else if (this.tf === false) {
    this.snack.openSnackBar('You do not have permission for this.', 2000);
  };
    this.refreshAfterEdit();
  }

  selectCheckedInToggle(key: string) {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
    .child('admin').once('value').then(snapshot => {
      this.tf = snapshot.val();
      console.log(this.tf);
    })

    if (this.tf === true) {

    this.selectedItem = this.itemList.filter(x => x.$key === key)[0];

    if (this.selectedItem.checkedIn === true) {
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.selectedItem.joined, this.selectedItem.complete, false);
      editedItem.lastUpdate = new Date().toISOString();
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
    else {
      let editedItem = new Item(this.selectedItem.mac, this.selectedItem.location, this.selectedItem.port, this.selectedItem.created_at,
        this.selectedItem.created_by, this.selectedItem.joined, this.selectedItem.complete, true);
      editedItem.lastUpdate = new Date().toISOString();
      this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    };
  }
    else if (this.tf === false) {
      this.snack.openSnackBar('You do not have permission for this.', 2000);
    };
    this.refreshAfterEdit();
  }

  onSave() {
    this.db.database.ref('/users/').child(this.afAuth.auth.currentUser.uid).child('role')
    .child('admin').once('value').then(snapshot => {
      this.tf = snapshot.val();
      console.log(this.tf);
    })

    if (this.tf === true) {
    let editedItem = new Item(this.edit.mac, this.edit.location, this.edit.port, this.selectedItem.created_at,
      this.selectedItem.created_by, this.selectedItem.joined, this.selectedItem.complete, this.selectedItem.checkedIn);
    editedItem.lastUpdate = new Date().toISOString();

    this.inventoryService.editItem(this.selectedItem.$key, editedItem);
    }
    else if (this.tf === false) {
      this.snack.openSnackBar('You do not have permission for this.', 2000);
    };
    this.refreshAfterEdit();
  }

  //After edit, refresh query
  refreshAfterEdit() {
    if (this.selected === 'joined') {
      this.getJoined();
    }
    else if (this.selected === 'notJoined') {
      this.getNotJoined();
    }
    else if (this.selected === 'joinedNotCompleted') {
      this.getJoinedNotCompleted();
    }
    else if (this.selected === 'completed') {
      this.getComplete();
    }
    else {
      this.ngOnInit();
    }
  }

    //Query functions for mat-select
  getJoined() {
    let data = this.inventoryService.getTrue('joined');
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
    let data = this.inventoryService.getTrue('complete');
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
    let data = this.inventoryService.getFalse('joined');
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
    let data = this.inventoryService.getFalse('complete');
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

  toggleSet(changeEvent: MatSlideToggleChange) {
    if (changeEvent.checked) {
      this.show = false;
      this.setUpDown = "Tear Down";
      this.displayedColumns = ['seqNo', 'mac', 'location', 'port', 'checkedIn', 'edit'];
    }
    else {
      this.setUpDown = "Setup";
      this.show = true;
      this.displayedColumns = ['seqNo', 'mac', 'location', 'port', 'created_at', 'created_by', 'joined', 'complete', 'edit', 'trash'];
    }
  }
}
