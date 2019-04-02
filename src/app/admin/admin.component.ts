import { Component, OnInit, NgModule } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
@NgModule({
  imports: [AdminComponent],
  exports: [AdminComponent]
})
export class AdminComponent implements OnInit {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(public dialog: MatDialog,
              private store: AngularFireStorage) { }

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


/*  uploadImage(event) {
    let file = event.target.files[0];
    let path = 'floorplans/${file.name}'
    if (file.type.split('/')[0] !== 'image') {
      return alert('error')
    }
    else {
      let ref = this.store.ref(path)
      let task = this.store.upload(path, file);
      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = ref.getDownloadURL();
          this.downloadURL.subscribe(url => {
            console.log(url);
          });
        }
        )
      ).subscribe();
    }
  }*/
}
