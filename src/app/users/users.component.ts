import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../shared/snackbar.service';
import { Userm } from '../shared/services/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['seqNo', 'email', 'role', 'edit'];

  userList: Userm[];
  user: Userm;
  selectedUser: Userm;

  selected;

  tf: boolean;

  edit = new Userm("","");

  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private auth: AuthenticationService,
              private router: Router,
              private snack: SnackbarService,
              public dialog: MatDialog,) {

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {

    let data = this.auth.getallUsers();
    data.snapshotChanges().subscribe(item => {
      this.userList = [];

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.userList.push(json as Userm);
      });
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.sort = this.sort;
    });
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '250px',
    });
    this.tf = this.auth.isSuperUser();

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
    });
  }

  selectUser(key: string, modal: string) {
    this.selectedUser = this.userList.filter(x => x.$key === key)[0];
    this.edit.email = this.selectedUser.email;
    this.selected = this.selectedUser.rolestring;
    this.openModal(modal);
  }

  onSave() {

    if (this.auth.isSuperUser() == false) {
      this.snack.openSnackBar('You do not have permission for this.', 2000);
    }
    else {

    let editedUser = new Userm(this.selectedUser.$key, this.edit.email)
    editedUser.rolestring = this.selected
    if (this.selected === 'noaccess') {
      editedUser.role.user = false;
      editedUser.role.admin = false;
      editedUser.role.superuser = false;
      this.auth.updateUser(this.selectedUser.$key, editedUser);
    }
    else if (this.selected === 'user') {
      editedUser.role.user = true;
      editedUser.role.admin = false;
      editedUser.role.superuser = false;
      this.auth.updateUser(this.selectedUser.$key, editedUser);
    }
    else if (this.selected === 'admin') {
      editedUser.role.user = true;
      editedUser.role.admin = true;
      editedUser.role.superuser = false;
      this.auth.updateUser(this.selectedUser.$key, editedUser);
    }
    else {
      editedUser.role.user = true;
      editedUser.role.admin = true;
      editedUser.role.superuser = true;
      this.auth.updateUser(this.selectedUser.$key, editedUser);
    };
  };
}

}
