import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AdditemComponent>) { }

  public closeMe() {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
