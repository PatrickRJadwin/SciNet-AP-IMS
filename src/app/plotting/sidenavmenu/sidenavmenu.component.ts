
import {AfterViewInit, Component, HostListener, Input} from '@angular/core';
import {fabric} from 'fabric';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenavmenu.component.html',
  styleUrls: ['./sidenavmenu.component.scss']
})
export class SidenavmenuComponent implements AfterViewInit {
  constructor() { }

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

  // Variables to be used for building canvas around floorplan image
  private static fpImageCurrent;
  private static fpWidth;
  private static fpHeight;

  // Booleans to determine current mode of interaction with canvas (editing plotted points or panning canvas)
  private static _EDIT_MODE = true;
  private static _PAN_MODE = false;

  // Reference variables to be used for programmatic modification of canvas and canvas objects
  static canvasRef;

  canvas: any;

// Method to load floorplan image from floorplan card
  public static loadFloorplan(fpImage, fpName) {
    console.log('Received Floorplan: ' + fpImage + ' ' + fpName);

    const tempImage = new Image();
    tempImage.addEventListener('load', () => {
      console.log('width: ' + tempImage.naturalWidth + ', height: ' + tempImage.naturalHeight);
    });
    tempImage.src = fpImage;

    if (tempImage.naturalWidth > window.innerWidth * .9) {
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

    this.prototype.implementFloorplan();
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

    console.log('Zoom Start: ' + zoom);

    // Zoom in
    if (zoomChoice === 0) {
      zoom += .2;

      if (zoom > 4) {
        zoom = 4;
      }

      console.log('Zoom End: ' + zoom);
    }

    // Zoom out
    if (zoomChoice === 1) {
      zoom -= .2;

      if (zoom < 0.2) {
        zoom = 0.2;
      }

      console.log('Zoom End: ' + zoom);
    }

    SidenavmenuComponent.canvasRef.setZoom(zoom);
  }

// Method to update canvas with chosen floorplan as background
  implementFloorplan() {
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

    this.captureEvents();
    this.panView();
    console.log('Loaded Floorplan');
  }

// Method to change plotted device's name
  public changeDeviceName(imgCaption, deviceGroup, canvasRef) {
    const editText = new fabric.IText(imgCaption.text.toString(), {
      fontSize: 30,
      originX: 'center',
      originY: 'center',
      left: deviceGroup.left,
      top: deviceGroup.top - 45,
      textBackgroundColor: 'white'
    });

    document.onkeydown = e => {
      if (e.keyCode === 13) {
        editText.exitEditing();
      }
    };

    SidenavmenuComponent.textboxOpen = true;

    console.log('Enter ' + SidenavmenuComponent.textboxOpen);

    canvasRef.add(editText);
    editText.enterEditing();

    canvasRef.on('mouse:down', function submit() {
      if (SidenavmenuComponent.textboxOpen === true) {
        editText.exitEditing();
      }
    });

    const removeTextbox = function updateText() {
      imgCaption.insertChars(editText.text.toString(), null, 0, 100);
      canvasRef.remove(editText);
      SidenavmenuComponent.textboxOpen = false;
      console.log('Leave ' + SidenavmenuComponent.textboxOpen);

      editText.off('editing:exited', removeTextbox);
    };

    editText.on('editing:exited', removeTextbox);
  }


// Initialize the component
  ngAfterViewInit() {
    console.log(SidenavmenuComponent.plottedDevices.length);

    SidenavmenuComponent.canvasRef = this.canvas;
/*
    this.canvas.setHeight(this.fpHeight);
    this.canvas.setWidth(this.fpWidth);
    this.captureEvents(); */
  }


// Listener for user events on canvas
  captureEvents() {
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

      } else if ((SidenavmenuComponent.textboxOpen === false) && (isDragEnd === false) && (SidenavmenuComponent._EDIT_MODE)) {
        // Console logs for testing/verification purposes only
        console.log('devices: ' + SidenavmenuComponent.plottedDevices.length);

        // Thank you fabric for making this super useful function very easy to find in your documentation </sarcasm>
        const pointer = SidenavmenuComponent.canvasRef.getPointer(event, false);

        // Create default device name based on device array length, with try/catch in case of undefined array
        let name = 'device';
        try {
          name += SidenavmenuComponent.plottedDevices.length;
        } catch {
          name += '1';
        }

        // Create a caption for the device with a default name
        const imgCaption = new fabric.IText(name, {
          fontSize: 20,
          originX: 'center',
          originY: 'top',
          top: 35,
          textBackgroundColor: 'darkgrey'
        });

        // Create the device icon itself
        const imgElement = new Image();
        imgElement.src = 'https://i.imgur.com/Q5skAxA.png'; // Device Icon URL
        const imgInstance = new fabric.Image(imgElement, {
          originX: 'center',
          originY: 'top',
          scaleX: .2,
          scaleY: .2
        });

        // Create a group for the icon and caption
        const deviceGroup = new fabric.Group([imgInstance, imgCaption], {
          originX: 'center',
          originY: 'center',
          left: pointer.x,
          top: pointer.y,
        });

        SidenavmenuComponent.canvasRef.add(deviceGroup); // Add device to canvas
        SidenavmenuComponent.plottedDevices.push(deviceGroup); // Add device to device array

        SidenavmenuComponent.prototype.changeDeviceName(imgCaption, deviceGroup, SidenavmenuComponent.canvasRef); // Open caption editor
      }
    });

    // Event: On double click, if target is device, re-open device caption editor
    SidenavmenuComponent.canvasRef.on('mouse:dblclick', function edit(options) {
      if (options.target && SidenavmenuComponent._EDIT_MODE) {
        SidenavmenuComponent.prototype.changeDeviceName(options.target._objects[1], options.target, SidenavmenuComponent.canvasRef); // Open caption editor
      } else {
        console.log('double clicked canvas');
      }
    });
  }

// Function to delete currently selected object
  deleteObject() {
    for (let i = 0; i < SidenavmenuComponent.plottedDevices.length; i++) {
      if (SidenavmenuComponent.plottedDevices[i] === SidenavmenuComponent.canvasRef.getActiveObject()) {
        SidenavmenuComponent.plottedDevices.splice(i, 1);
      }
    }
    SidenavmenuComponent.canvasRef.remove(SidenavmenuComponent.canvasRef.getActiveObject());
  }

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
    });
  }
}
