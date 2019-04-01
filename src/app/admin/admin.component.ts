import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Image } from './image.model';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageService } from '../shared/services/image.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  selectedFiles: FileList;
  file: File;
  imgsrc;

  constructor(public dialog: MatDialog,
              private storage: AngularFireStorage,
              private image: Image,
              private imageService: ImageService) { }

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

  chooseFiles(event) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0))
      this.uploadPic();
  }

  uploadPic() {
    let file = this.selectedFiles.item(0);
    let uniqkey = 'pic' + Math.floor(Math.random() * 1000000);
    const uploadTask = this.storage.upload('/floorplans/' + uniqkey, file).then(() => {
      const ref = this.storage.ref('/floorplans/' + uniqkey);
      const downloadUrl = ref.getDownloadURL().subscribe(url => {
        this.image.url = url;
        this.imageService.addImage(this.image);
      })
    });
  }
}
