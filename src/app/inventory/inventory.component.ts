import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { AdditemComponent } from '../additem/additem.component';

export interface PeriodicElement {
  seqNo: number;
  name: string;
  location: string;
  port: string;
  created_at: Date;
  created_by: string;
  joined: boolean;
  complete: boolean;
  edit: string;
  trash: string;
}



// **Sample data**
const dateString = '11/05/2018';
const date = new Date(dateString);

const ELEMENT_DATA: PeriodicElement[] = [
  {seqNo: 1, name: 'AP-BDE4', location: 'C-1', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: true, complete: true, edit: 'edit', trash: 'trash'},
  {seqNo: 2, name: 'AP-BDX9', location: 'C-3', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: true, complete: false, edit: 'edit', trash: 'trash'},
  {seqNo: 3, name: 'AP-BDS7', location: 'C-3', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: true, complete: true, edit: 'edit', trash: 'trash'},
  {seqNo: 4, name: 'AP-WB5', location: 'C-2', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: true, complete: true, edit: 'edit', trash: 'trash'},
  {seqNo: 5, name: 'AP-BSB1', location: 'C-1', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: true, complete: true, edit: 'edit', trash: 'trash'},
  {seqNo: 6, name: 'AP-ZDB3', location: 'C-2', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: false, complete: true, edit: 'edit', trash: 'trash'},
  {seqNo: 7, name: 'AP-BDC1', location: 'C-1', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: false, complete: true, edit: 'edit', trash: 'trash'},
  {seqNo: 8, name: 'AP-BDB2', location: 'C-5', port: 'Desktop Switch', created_at: date, created_by: 'undefined', joined: true, complete: false, edit: 'edit', trash: 'trash'},

];
// **Sample data**

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  // Columns for table
  displayedColumns: string[] = ['seqNo', 'name', 'location', 'port', 'created_at', 'created_by', 'joined', 'complete', 'edit', 'trash'];
  // Datasource var, will replace with db data
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdditemComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}
