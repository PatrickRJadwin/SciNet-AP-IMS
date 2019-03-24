import { Component, OnInit } from '@angular/core';
import {fabric} from 'fabric';
import { AngularFireStorage } from 'angularfire2/storage';
import { Image } from './image.model';
import { ImageService } from '../../shared/services/image.service'; 

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenavmenu.component.html',
  styleUrls: ['./sidenavmenu.component.scss']
})
export class SidenavmenuComponent implements OnInit {
  selectedFiles: FileList;
  file: File;
  imgsrc;

  constructor(private storage: AngularFireStorage,
              private image: Image,
              private imageService: ImageService) { 
                console.log(imageService.getImage());
              }

  canvas: any;

  ngOnInit() {
    this.canvas = new fabric.Canvas('myCanvas');
    this.canvas.add(new fabric.IText('Test'));
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
