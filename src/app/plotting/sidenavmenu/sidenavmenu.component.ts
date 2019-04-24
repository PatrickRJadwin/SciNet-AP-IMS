import {AfterViewInit, Component, HostListener, Input} from '@angular/core';
import {fabric} from 'fabric';
import {fromEvent} from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageService } from 'src/app/shared/services/image.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ImageModel } from 'src/app/shared/image.model';
import {IText, Canvas} from "fabric/fabric-impl";
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'img-model'
})
export class Img {
  $key: string;
  url: string;
  json: string;

  constructor(url, string) {
    this.url = url;
    this.json = string;
  }
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenavmenu.component.html',
  styleUrls: ['./sidenavmenu.component.scss']
})
export class SidenavmenuComponent implements AfterViewInit {
  constructor(private db: AngularFireDatabase,
    public dialog: MatDialog,
    private storage: AngularFireStorage,
    private imageService: ImageService,
    private afAuth: AngularFireAuth,
    private auth: AuthenticationService,
    private snack: SnackbarService) { }

  selectedFiles: File;
  file: File;
  imgsrc;
  image: ImageModel;
  public tf: boolean;
  public message: String;
  public imagePath;
  imgURL: any;


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


  preview(files, event) {
    this.selectedFiles = event.target.files[0];

    if (files.length === 0)
      return;

    var mimetype = files[0].type;
    if (mimetype.match(/image\/*/) == null) {
      this.message = "Only images are supported";
      return
    }

    var reader = new FileReader();

    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  uploadPic() {
    let file = this.selectedFiles;
    let uniqkey = 'pic' + Math.floor(Math.random() * 1000000);
    const uploadTask = this.storage.upload('/floorplans/' + uniqkey, file).then(() => {
      const ref = this.storage.ref('/floorplans/' + uniqkey);
      const downloadUrl = ref.getDownloadURL().subscribe(url => {
        this.image = new ImageModel(url);
        this.image.url = url;
        this.imageService.addLink(this.image);
      })
    });
    this.dialog.closeAll();
  }

  // Getter and Setter for EDIT_MODE boolean
  static get EDIT_MODE(): boolean {
    return this._EDIT_MODE;
  }

  static set EDIT_MODE(value: boolean) {
    this._EDIT_MODE = value;
  }

// Getter and Setter for PAN_MODE boolean
  static get PAN_MODE(): boolean {
    return this._PAN_MODE;
  }

  static set PAN_MODE(value: boolean) {
    this._PAN_MODE = value;
  }

  // Array of all currently plotted devices
  public static plottedDevices = [];

  // Boolean to check if a device's name is currently being edited
  public static textboxOpen = false;

  private static isActiveDevice = false;

  // Boolean to check if mouse is currently over the floorplan
  private static mouseOverCanvas;

  // Variables to be used for building canvas around floorplan image
  private static fpImageCurrent;
  private static fpWidth;
  private static fpHeight;

  // Booleans to determine current mode of interaction with canvas (editing plotted points or panning canvas)
  private static _EDIT_MODE = true;
  private static _PAN_MODE = false;

  // Reference variables to be used for programmatic modification of canvas and canvas objects
  static canvasRef;

  // Variables for current URL, and imgList
  public static current;
  public static currentImg;
  public static imgList: Img[];

  canvas: any;

  public static isLoading = false;

// Method to load floorplan image from floorplan card
  public static loadFloorplan(fpImage, fpName) {
    SidenavmenuComponent.isLoading = true;
    this.current = fpImage;

    const tempImage = new Image();

    tempImage.addEventListener('load', () => {
    });
    tempImage.src = fpImage;

    this.currentImg = tempImage;

    // If the floorplan is greater than 90%/less than 50% of the window width, set the canvas width to 90% of the window
    if ((tempImage.naturalWidth > window.innerWidth * .9) || (tempImage.naturalWidth <= window.innerWidth * .5)) {
      this.fpWidth = window.innerWidth * .9;
    } else {
      this.fpWidth = tempImage.naturalWidth;
    }

    this.fpHeight = window.innerHeight * .8;

    this.fpImageCurrent = new fabric.Image(tempImage, {
      originX: 'left',
      originY: 'top',
      selectable: false,
      strokeWidth: 2,
      stroke: 'black'
    });


    this.prototype.implementFloorplan(fpImage);
  }

// Event Handler for keyboard events on canvas
  private static keyEventHandler(event) {
    if (event.keyCode === 46) {
      SidenavmenuComponent.prototype.deleteObject();
    } else {
      console.log(event.keyCode);
    }
  }

// Method to allow/disallow object interaction and change cursor style depending on mode (Edit/Pan)
  static allowObjectSelect(choice) {
    switch (choice) {
      case 0:
        SidenavmenuComponent.canvasRef.defaultCursor = 'default';
        SidenavmenuComponent.canvasRef.hoverCursor = 'move';
        for (let i = 0; SidenavmenuComponent.plottedDevices.length; i++) {
          SidenavmenuComponent.canvasRef.item(i).selectable = true;
        }
        break;
      case 1:
        SidenavmenuComponent.canvasRef.defaultCursor = 'grab';
        SidenavmenuComponent.canvasRef.hoverCursor = 'grab';
        for (let i = 0; SidenavmenuComponent.plottedDevices.length; i++) {
          SidenavmenuComponent.canvasRef.item(i).selectable = false;
        }
        break;
    }
  }

// Method to adjust canvas zoom level
  static zoomView(zoomChoice) {
    let zoom = SidenavmenuComponent.canvasRef.getZoom();

    // Zoom in
    if (zoomChoice === 0) {
      zoom += .2;

      if (zoom > 4) {
        zoom = 4;
      }
    }

    // Zoom out
    if (zoomChoice === 1) {
      zoom -= .2;

      if (zoom < 0.2) {
        zoom = 0.2;
      }
    }

    SidenavmenuComponent.canvasRef.setZoom(zoom);
  }

// Method to update canvas with chosen floorplan as background
  implementFloorplan(url) {
    document.getElementById('canvasWrap').style.display = 'block';

    try {
      SidenavmenuComponent.plottedDevices.length = 0;
      SidenavmenuComponent.textboxOpen = false;

      SidenavmenuComponent.canvasRef.clear();
      SidenavmenuComponent.canvasRef.dispose();

    } catch (err) {
      console.log(err);
    }

    SidenavmenuComponent.canvasRef = new fabric.Canvas('myCanvas');

    SidenavmenuComponent.canvasRef.backgroundColor = 'grey';

    SidenavmenuComponent.canvasRef.setHeight(SidenavmenuComponent.fpHeight);
    SidenavmenuComponent.canvasRef.setWidth(SidenavmenuComponent.fpWidth);



    SidenavmenuComponent.canvasRef.setBackgroundImage(SidenavmenuComponent.fpImageCurrent);

    if (SidenavmenuComponent.imgList.filter(x => x.url === url).length === 1) {
      SidenavmenuComponent.canvasRef.loadFromJSON(SidenavmenuComponent.imgList.filter(x => x.url === url)[0].json);
    }

    this.captureEvents();
    this.panView();
    SidenavmenuComponent.isLoading = false;
  }

// Method to change plotted device's name
  public changeDeviceName(imgCaption, deviceGroup, canvasRef) {
    SidenavmenuComponent.textboxOpen = true;

    const editText = new fabric.IText(imgCaption.text.toString(), {
      fontSize: 30,
      originX: 'center',
      originY: 'center',
      left: deviceGroup.left,
      top: deviceGroup.top - 45,
      textBackgroundColor: 'white',
      selectable: false
    });

    const colorBG = new fabric.Ellipse({
      fill: 'grey',
      rx: 85,
      ry: 15,
      left: deviceGroup.left - 85,
      top: deviceGroup.top + 35,
      selectable: false,
      hoverCursor: 'default'
    });

    const blue = new fabric.Circle({
      name: 'blue',
      radius: 10,
      fill: 'blue',
      left: deviceGroup.left - 70,
      top: deviceGroup. top + 40,
      selectable: false,
      hoverCursor: 'pointer'
    });

    const green = new fabric.Circle({
      name: 'green',
      radius: 10,
      fill: 'green',
      left: deviceGroup.left - 40,
      top: deviceGroup. top + 40,
      selectable: false,
      hoverCursor: 'pointer'
    });

    const purple = new fabric.Circle({
      name: 'purple',
      radius: 10,
      fill: 'purple',
      left: deviceGroup.left - 10,
      top: deviceGroup. top + 40,
      selectable: false,
      hoverCursor: 'pointer'
    });

    const red = new fabric.Circle({
      name: 'red',
      radius: 10,
      fill: 'red',
      left: deviceGroup.left + 20,
      top: deviceGroup. top + 40,
      selectable: false,
      hoverCursor: 'pointer'
    });

    const yellow = new fabric.Circle({
      name: 'yellow',
      radius: 10,
      fill: 'yellow',
      left: deviceGroup.left + 50,
      top: deviceGroup. top + 40,
      selectable: false,
      hoverCursor: 'pointer'
    });

    document.onkeydown = e => {
      if (e.keyCode === 13) {
        editText.exitEditing();
      }
    };

    canvasRef.add(editText);
    canvasRef.add(colorBG, blue, green, purple, red, yellow);
    editText.enterEditing();

    function submit(e) {
      try {
        if ((e.target.type.toString() !== 'i-text') && (e.target !== deviceGroup)
              && (e.target !== colorBG) && (e.target !== blue) && (e.target !== green)
                && (e.target !== purple) && (e.target !== red) && (e.target !== yellow)) {
          editText.exitEditing();
        } else if (editText.left !== deviceGroup.left) {
          if (editText.top !== deviceGroup.top - 45) {
            editText.top = deviceGroup.top - 45;
            colorBG.top = deviceGroup.top + 35;
            blue.top = deviceGroup.top + 40;
            green.top = deviceGroup.top + 40;
            purple.top = deviceGroup.top + 40;
            red.top = deviceGroup.top + 40;
            yellow.top = deviceGroup.top + 40;
          }
          editText.left = deviceGroup.left;
          colorBG.left = deviceGroup.left - 85;
          blue.left = deviceGroup.left - 70;
          green.left = deviceGroup.left - 40;
          purple.left = deviceGroup.left - 10;
          red.left = deviceGroup.left + 20;
          yellow.left = deviceGroup.left + 50;
        }

        if (e.target.name !== undefined) {
          switch (e.target.name) {
            case 'blue':
              console.log(e.target.name);
              SidenavmenuComponent.prototype.deviceColor(deviceGroup, 0);
              break;
            case 'green':
              SidenavmenuComponent.prototype.deviceColor(deviceGroup, 1);
              break;
            case 'purple':
              SidenavmenuComponent.prototype.deviceColor(deviceGroup, 2);
              break;
            case 'red':
              SidenavmenuComponent.prototype.deviceColor(deviceGroup, 3);
              break;
            case 'yellow':
              SidenavmenuComponent.prototype.deviceColor(deviceGroup, 4);
              break;
            default:
              console.log('Error: Invalid switch case (Line 405 - Sidenavmenu)');
              break;
          }
        }
      } catch {
        editText.exitEditing();
      }
    }

    function updateText() {
      imgCaption.insertChars(editText.text.toString(), null, 0, 100);
      canvasRef.remove(editText, colorBG, blue, green, purple, red, yellow);
      SidenavmenuComponent.textboxOpen = false;

      canvasRef.off('mouse:up', submit);
      editText.off('editing:exited', updateText);
    }

    canvasRef.on('mouse:up', submit)
    editText.on('editing:exited', updateText);
  }


// Initialize the component
  ngAfterViewInit() {
    let data = this.db.list('floorplanJson');
    data.snapshotChanges().subscribe(item => {
      SidenavmenuComponent.imgList = [];

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        SidenavmenuComponent.imgList.push(json as Img);
      });
    });
  }


// Listener for user events on canvas
  captureEvents() {
    SidenavmenuComponent.plottedDevices = SidenavmenuComponent.canvasRef.getObjects();
    const rect = document.getElementById('myCanvas').getBoundingClientRect();
    const canvasWrapper = document.getElementById('canvasWrap');

    let isMouseDown = false;
    let isMouseDrag = false;

    // Event: When delete button (key code: 46) is pressed, delete currently selected object
    canvasWrapper.tabIndex = 1000;
    canvasWrapper.addEventListener('keydown', SidenavmenuComponent.keyEventHandler, false);

    // Event: On mouse down, mark "isMouseDown" as true
    SidenavmenuComponent.canvasRef.on('mouse:down', options => {
      isMouseDown = true;
    });

    // Event: On mouse move, give "isMouseDrag" the same value as "isMouseDown"
    SidenavmenuComponent.canvasRef.on('mouse:move', options => {
      isMouseDrag = isMouseDown;
    });

    // Event: When canvas is clicked, do something
    SidenavmenuComponent.canvasRef.on('mouse:up', function plot(options) {
      const PLOTTING = SidenavmenuComponent;

      // If mouse was being dragged after mouse down, do not plot a new point
      isMouseDown = false;
      const isDragEnd = isMouseDrag;
      isMouseDrag = false;

      /* If clicking an object, do nothing
         If mouse was being dragged after mouse down, do nothing
         If text box for device name is open, do nothing
         Else, plot new device
      */
      if (options.target) {

      } else if ((!PLOTTING.textboxOpen) && (!isDragEnd) && (PLOTTING._EDIT_MODE) && (PLOTTING.mouseOverCanvas) && (!PLOTTING.isActiveDevice)) {

        // Thank you fabric for making this super useful function very easy to find in your documentation </sarcasm>
        const pointer = PLOTTING.canvasRef.getPointer(event, false);

        // Create default device name based on device array length, with try/catch in case of undefined array
        let name = 'device';
        try {
          name += PLOTTING.plottedDevices.length;
        } catch {
          name += '1';
        }

        // Create a caption for the device with a default name
        const imgCaption = new fabric.IText(name, {
          fontSize: 20,
          originX: 'center',
          originY: 'top',
          top: 45,
          textBackgroundColor: 'darkgrey'
        });

        // Create the device icon itself
        const imgElement = new Image();

        // When icon image is loaded, create the rest of the device group
        imgElement.onload = () => {
          const imgInstance = new fabric.Image(imgElement, {
            originX: 'center',
            originY: 'top',
            scaleX: .1,
            scaleY: .1
          });

          // Create a group for the icon and caption
          const deviceGroup = new fabric.Group([imgInstance, imgCaption], {
            name: '' + name,
            originX: 'center',
            originY: 'center',
            left: pointer.x,
            top: pointer.y,
            hasControls: false
          });

          PLOTTING.canvasRef.add(deviceGroup); // Add device to canvas
          PLOTTING.plottedDevices.push(deviceGroup); // Add device to device array
          PLOTTING.canvasRef.setActiveObject(deviceGroup);

          PLOTTING.prototype.changeDeviceName(imgCaption, deviceGroup, PLOTTING.canvasRef); // Open caption editor
        };

        imgElement.src = 'assets/images/device_icon_blue.svg'; // Device Icon URL
      }

      // If a device or group of devices is currently selected, do not plot a device on next click on canvas
      if (options.target !== null) {
        PLOTTING.isActiveDevice = true;
      } else if (isDragEnd && (PLOTTING.canvasRef.getActiveObjects().length > 0)) {
        PLOTTING.isActiveDevice = true;
      } else if (options.target === null) {
        PLOTTING.isActiveDevice = false;
      }
    });

    // Event: On double click, if target is device, re-open device caption editor
    SidenavmenuComponent.canvasRef.on('mouse:dblclick', function edit(options) {
      const PLOTTING = SidenavmenuComponent;

      if (options.target && PLOTTING._EDIT_MODE && PLOTTING.textboxOpen !== true) {
        PLOTTING.prototype.changeDeviceName(options.target._objects[1], options.target, PLOTTING.canvasRef); // Open caption editor
      } else {
        console.log('double clicked canvas');
      }
    });

    // Event: When mouse moves over a new target, check if it's still over the floorplan image
    SidenavmenuComponent.canvasRef.on('mouse:move', function track(e) {
      const PLOTTING = SidenavmenuComponent;

      const pointer = PLOTTING.canvasRef.getPointer(event, false);
      const border = PLOTTING.currentImg;

      if ((pointer.x < 0) || (pointer.y < 0) || (pointer.x > border.naturalWidth) || (pointer.y > border.naturalHeight)) {
        PLOTTING.mouseOverCanvas = false;
      } else {
        PLOTTING.mouseOverCanvas = true;
      }
    });
  }

// Function to delete currently selected objects
  deleteObject() {
    const PLOTTING = SidenavmenuComponent;
    const devices = PLOTTING.canvasRef.getActiveObjects();

    for (let i = 0; i < PLOTTING.plottedDevices.length; i++) {
      for (let j = 0; j < PLOTTING.canvasRef.getActiveObjects().length; j++) {
        if (PLOTTING.plottedDevices[i] === PLOTTING.canvasRef.getActiveObjects()[j]) {
          PLOTTING.plottedDevices.splice(i, 1);
        }
      }
    }

    for (let i = 0; i < devices.length; i++) {
      PLOTTING.canvasRef.remove(devices[i]);
    }
    PLOTTING.canvasRef.discardActiveObject();
    PLOTTING.isActiveDevice = false;
  }

// Function to change device icon color
  deviceColor(device, color) {
    let imgUrl;

    switch (color) {
      case 0:
        imgUrl = 'assets/images/device_icon_blue.svg';
        break;
      case 1:
        imgUrl = 'assets/images/device_icon_green.svg';
        break;
      case 2:
        imgUrl = 'assets/images/device_icon_purple.svg';
        break;
      case 3:
        imgUrl = 'assets/images/device_icon_red.svg';
        break;
      case 4:
        imgUrl = 'assets/images/device_icon_yellow.svg';
        break;
    }

    try {
      const img = new Image();

      img.onload = () => {
        const imgInstance = new fabric.Image(img, {
          originX: 'center',
          originY: 'top',
          scaleX: .1,
          scaleY: .1,
          top: -34.5
        });


        device.insertAt(imgInstance, 0, false);
        device.removeWithUpdate(device._objects[1]);
      };

      img.src = imgUrl;
    } catch {
      this.snack.openSnackBar('No device selected', 2000);
    }
  }

// Function for panning view of canvas
  panView() {
    SidenavmenuComponent.canvasRef.on('mouse:down', function(opt) {
      const evt = opt.e;
      if (SidenavmenuComponent._PAN_MODE === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });

    SidenavmenuComponent.canvasRef.on('mouse:move', function(opt) {
      if (this.isDragging) {
        const e = opt.e;
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    SidenavmenuComponent.canvasRef.on('mouse:up', function(opt) {
      this.isDragging = false;
      this.selection = true;
      const objects = SidenavmenuComponent.canvasRef.getObjects();

      for (let i = 0; i < objects.length; i++) {
        objects[i].setCoords();
      }
    });
  }

  // Will save Json and url in fb or update if already in fb
  saveJson() {
    if (this.auth.isAdmin() == true) {
      var json = JSON.stringify(SidenavmenuComponent.canvasRef);

      var img = new Img(SidenavmenuComponent.current, json);

      if (SidenavmenuComponent.imgList.filter(x => x.url === SidenavmenuComponent.current).length === 1) {
        this.db.object('floorplanJson/' + SidenavmenuComponent.imgList.filter(x => x.url === SidenavmenuComponent.current)[0].$key).update(img);
      }
      else {
        this.db.list('floorplanJson').push(img);
      }
    }
    else {
      this.snack.openSnackBar('You do not have permission for this', 2500);
    }

  }

  testSVG() {
    const PLOTTING = SidenavmenuComponent;
    const fpImage = PLOTTING.currentImg;

    const originalheight = PLOTTING.fpHeight;
    const originalwidth = PLOTTING.fpWidth;

    PLOTTING.canvasRef.setHeight(fpImage.naturalHeight);
    PLOTTING.canvasRef.setWidth(fpImage.naturalWidth);

    const newWindow = window.open('about:blank', '_blank');
    const newDIV = document.createElement('div');

    newDIV.innerHTML = PLOTTING.canvasRef.toSVG();
    newWindow.document.body.appendChild(newDIV);
    newWindow.focus();
    newWindow.window.print();

    PLOTTING.canvasRef.setHeight(originalheight);
    PLOTTING.canvasRef.setWidth(originalwidth);
  }

}
