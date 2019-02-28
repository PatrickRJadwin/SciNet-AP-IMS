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

  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog, private inventoryService: InventoryService) {
    inventoryService.getAllItems();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  

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

  onDelete(key: string) {
    this.inventoryService.deletebyKey(key);
  }

}
