import { Component, OnInit } from '@angular/core';
import {fabric} from 'fabric';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenavmenu.component.html',
  styleUrls: ['./sidenavmenu.component.scss']
})
export class SidenavmenuComponent implements OnInit {
  selectedFiles: FileList;
  file: File;
  imgsrc;

  constructor(private storage: AngularFireStorage) { }

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

  url;
  uploadPic() {
    let file = this.selectedFiles.item(0);
    let uniqkey = 'pic' + Math.floor(Math.random() * 1000000);
    const uploadTask = this.storage.upload('/floorplans/' + uniqkey, file).then(() => {
      const ref = this.storage.ref('/floorplans/' + uniqkey);
      const downloadUrl = ref.getDownloadURL().subscribe(url => {
        const Url = url;
        this.url = url;
        console.log(Url);
      })
    });
  }
}
