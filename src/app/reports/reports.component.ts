import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../inventory/inventory.model';
import { AngularFireList } from 'angularfire2/database';

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

  constructor(private inventoryService: InventoryService) {

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
    });

    this.selectList = this.inventoryService.getRecentDates();
    this.selectList.snapshotChanges().subscribe(item => {
      this.selList = [];
      item.forEach(sel => {
        let json = sel.payload.toJSON();
        json["$key"] = sel.key;
        this.selList.push(json as Item);
      });
    });
  }

  setListByDate(date: string) {
    let data = this.inventoryService.getDateBy(date);
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

}
