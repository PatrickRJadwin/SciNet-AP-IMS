import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../inventory/inventory.model';
import { AngularFireList } from 'angularfire2/database';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {

  displayedColumns: string[] = ['seqNo', 'mac', 'location', 'port'];
  // dataSource var, replace with db data
  dataSource = new MatTableDataSource();

  itemList: Item[];
  selectList: AngularFireList<any[]>;
  selList: Item[];
  it = new Array;
  dates = new Array;

  constructor(private inventoryService: InventoryService,
              private auth: AuthenticationService,
              private router: Router) {

  }

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      this.itemList.forEach(element => {
        let k = formatDate(element.created_at, 'yyyy-MM-dd', 'en-us');
        this.it.push(k);
      });
      this.dates = this.it.filter((el, i, a) => i === a.indexOf(el));
    });
  }
  
  setListByDate(date: string) {
    let data = this.inventoryService.getAllItems();
    data.snapshotChanges().subscribe(item => {
        this.itemList = [];
  
      item.forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.itemList.push(json as Item);
        });
      });
      this.itemList = this.itemList.filter(x => x.created_at.substring(0, 10) == date);
      this.dataSource = new MatTableDataSource(this.itemList); 
  }

}
