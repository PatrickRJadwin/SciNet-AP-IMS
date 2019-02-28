import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './shared/material.module';
import { InventoryComponent } from './inventory/inventory.component';
import { UsersComponent } from './users/users.component';
import { PlottingComponent } from './plotting/plotting.component';
import { ReportsComponent } from './reports/reports.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdditemComponent } from './additem/additem.component';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SignupComponent } from './signup/signup.component';
import { environment } from 'src/environments/environment';

import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import {MatSidenavModule, MatButtonModule, MatCardModule,
        MatDividerModule, MatRippleModule, MatFormFieldModule,
        MatTooltipModule} from '@angular/material'; // <-- Material imports
import {CanvasComponent} from './plotting/sidenavmenu/canvas.component';
import {SidenavmenuComponent} from './plotting/sidenavmenu/sidenavmenu.component';

import {FloorplancardComponent} from './plotting/sidenav_cards/floorplan_card.component';
import {DevicecardComponent} from './plotting/sidenav_cards/device_card.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    UsersComponent,
    ReportsComponent,
    AdditemComponent,
    LoginComponent,
    SignupComponent,
    PlottingComponent, // Plotting Imports - Start
    SidenavmenuComponent,
    FloorplancardComponent,
    DevicecardComponent,
    CanvasComponent, // Plotting Imports - End
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
  ],
  entryComponents: [AdditemComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
