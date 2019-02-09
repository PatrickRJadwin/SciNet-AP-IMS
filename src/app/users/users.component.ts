import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  seqNo: number;
  email: string;
  role: string;
  edit: string;
}

// **Sample data**
const ELEMENT_DATA: PeriodicElement[] = [
  {seqNo: 1, email: 'something@something.com', role: 'superuser', edit: 'edit'},
  {seqNo: 2, email: 'something@something.com', role: 'superuser', edit: 'edit'},
  {seqNo: 3, email: 'something@something.com', role: 'admin', edit: 'edit'},
  {seqNo: 4, email: 'something@something.com', role: 'user', edit: 'edit'},
  {seqNo: 5, email: 'something@something.com', role: 'user', edit: 'edit'},
  {seqNo: 6, email: 'something@something.com', role: 'user', edit: 'edit'},
  {seqNo: 7, email: 'something@something.com', role: 'noaccess', edit: 'edit'},
  {seqNo: 8, email: 'something@something.com', role: 'admin', edit: 'edit'},
  {seqNo: 9, email: 'something@something.com', role: 'superuser', edit: 'edit'},
  {seqNo: 10, email: 'something@something.com', role: 'user', edit: 'edit'},
  {seqNo: 11, email: 'something@something.com', role: 'user', edit: 'edit'},
  {seqNo: 12, email: 'something@something.com', role: 'superuser', edit: 'edit'},
  {seqNo: 13, email: 'something@something.com', role: 'superuser', edit: 'edit'},
];
// **Sample data**

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['seqNo', 'email', 'role', 'edit'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
