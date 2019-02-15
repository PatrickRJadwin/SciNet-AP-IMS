import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  seqNo: number;
  name: string;
  location: string;
  port: string;
}

// **Sample data**
const ELEMENT_DATA: PeriodicElement[] = [
  {seqNo: 1, name: 'AP-BDE4', location: 'C-1', port: 'Desktop Switch'},
  {seqNo: 2, name: 'AP-BDX9', location: 'C-3', port: 'Desktop Switch'},
  {seqNo: 3, name: 'AP-BDS7', location: 'C-3', port: 'Desktop Switch'},
  {seqNo: 4, name: 'AP-WB5', location: 'C-2', port: 'Desktop Switch'},
  {seqNo: 5, name: 'AP-BSB1', location: 'C-1', port: 'Desktop Switch'},
  {seqNo: 6, name: 'AP-ZDB3', location: 'C-2', port: 'Desktop Switch'},
  {seqNo: 7, name: 'AP-BDC1', location: 'C-1', port: 'Desktop Switch'},
  {seqNo: 8, name: 'AP-BDB2', location: 'C-5', port: 'Desktop Switch'},

];
// **Sample data**

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  displayedColumns: string[] = ['seqNo', 'name', 'location', 'port'];
  // dataSource var, replace with db data
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}
