import { Component, OnInit, NgModule } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageModel } from './image.model';
import { ImageService } from '../shared/services/image.service';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticationService } from '../shared/services/authentication.service';


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
  selectedFiles: FileList;
  file: File;
  imgsrc;
  image: ImageModel;
  public tf: boolean;

  constructor(public dialog: MatDialog,
    private storage: AngularFireStorage,
    private imageService: ImageService,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private auth: AuthenticationService) {
      
  }

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
        
        this.image = new ImageModel(url);
        console.log(this.image.url);
        this.image.url = url;
        console.log(this.image.url);
        this.imageService.addLink(this.image);
        this.imageService.addImage(this.image);
      })
    });
  }
}
