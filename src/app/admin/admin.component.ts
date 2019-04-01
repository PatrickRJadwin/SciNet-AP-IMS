import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  
  openUpload(modal: string) {
    this.openModal(modal);
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
    });
  }
}
