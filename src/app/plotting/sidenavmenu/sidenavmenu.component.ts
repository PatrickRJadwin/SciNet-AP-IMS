
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

  // Array of all currently plotted devices
  public static plottedDevices = [];

  // Boolean to check if a device's name is currently being edited
  public static textboxOpen = false;

  private static fpImageCurrent;
  private static fpNameCurrent;
  private static fpWidth;
  private static fpHeight;

  canvas: any;

  // Tentative variables to size canvas according to window
  @Input() public fpWidth = window.innerWidth * .89;
  @Input() public fpHeight = window.innerHeight * .75;


// Method to load floorplan image from floorplan card
  public static loadFloorplan(fpImage, fpName) {
    console.log('Received: ' + fpImage + ' ' + fpName);

    const tempImage = new Image();
    tempImage.addEventListener('load', () => {
      console.log('width: ' + tempImage.naturalWidth + ', height: ' + tempImage.naturalHeight);
    });
    tempImage.src = fpImage;

    this.fpWidth = tempImage.naturalWidth;
    this.fpHeight = tempImage.naturalHeight;
    this.fpImageCurrent = new fabric.Image(tempImage, {
      originX: 'left',
      originY: 'top',
      selectable: false
    });

    this.prototype.implementFloorplan();
  }

// Method to update canvas with chosen floorplan as background
  implementFloorplan() {
    this.canvas = new fabric.Canvas('myCanvas');
    this.canvas.setHeight(SidenavmenuComponent.fpHeight);
    this.canvas.setWidth(SidenavmenuComponent.fpWidth);



    this.canvas.setBackgroundImage(SidenavmenuComponent.fpImageCurrent);

    this.captureEvents();
    console.log('fired');
  }

// Method to change plotted device's name
  public changeDeviceName(imgCaption, deviceGroup, canvasRef) {
    const editText = new fabric.IText(imgCaption.text.toString(), {
      fontSize: 30,
      originX: 'center',
      originY: 'center',
      left: deviceGroup.left,
      top: deviceGroup.top - 45,
      hasBorders: true
    });

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
/*
    this.canvas.setHeight(this.fpHeight);
    this.canvas.setWidth(this.fpWidth);
    this.captureEvents(); */
  }


// Listener for user events on canvas
  captureEvents() {
    const canvasRef = this.canvas;
    const rect = document.getElementById('myCanvas').getBoundingClientRect();


    // Event: When canvas is clicked, do something
    canvasRef.on('mouse:down', function plot(options) {
      /* If clicking an object, do nothing
         Else if clicking on canvas, plot new device
      */
      if (options.target) {

      } else if (SidenavmenuComponent.textboxOpen === false) {
        // Console logs for testing/verification purposes only
        console.log('devices: ' + SidenavmenuComponent.plottedDevices.length);

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
          top: 35
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
          left: options.e.clientX - (rect.left),
          top: options.e.clientY - (rect.top),
        });

        canvasRef.add(deviceGroup); // Add device to canvas
        SidenavmenuComponent.plottedDevices.push(deviceGroup); // Add device to device array

        SidenavmenuComponent.prototype.changeDeviceName(imgCaption, deviceGroup, canvasRef); // Open caption editor
      }
    });

    // Event: On double click, if target is device, re-open device caption editor
    canvasRef.on('mouse:dblclick', function edit(options) {
      if (options.target) {
        SidenavmenuComponent.prototype.changeDeviceName(options.target._objects[1], options.target, canvasRef); // Open caption editor
      } else {
        console.log('double clicked canvas');
      }
    });
  }

/*
  panZoom() {
    this.canvas.on('mouse:wheel', function(opt) {
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom = zoom + delta / 200;
      if (zoom > 20) {
        zoom = 20;
      }
      if (zoom < 0.01) {
        zoom = 0.01;
      }
      this.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      const vpt = this.viewportTransform;
      if (zoom < 400 / 1000) {
        this.viewportTransform[4] = 200 - 1000 * zoom / 2;
        this.viewportTransform[5] = 200 - 1000 * zoom / 2;
      } else {
        if (vpt[4] >= 0) {
          this.viewportTransform[4] = 0;
        } else if (vpt[4] < this.canvas.getWidth() - 1000 * zoom) {
          this.viewportTransform[4] = this.canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          this.viewportTransform[5] = 0;
        } else if (vpt[5] < this.canvas.getHeight() - 1000 * zoom) {
          this.viewportTransform[5] = this.canvas.getHeight() - 1000 * zoom;
        }
      }
    });

  }
*/

/*
  updateDeviceIcon(iconURL) {
    const infobox = document.getElementById('currentStatusIcon');
    const infoboxIcon = infobox.innerHTML;

    infoboxIcon.src = iconURL;
  }
*/
}
