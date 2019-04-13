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
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { MatSidenavModule, MatButtonModule, MatCardModule,
        MatDividerModule, MatRippleModule, MatFormFieldModule,
        MatTooltipModule, MatSelectModule, MatTabsModule,
        MatButtonToggleModule} from '@angular/material'; // <-- Material imports
import { SidenavmenuComponent } from './plotting/sidenavmenu/sidenavmenu.component';

import { FloorplancardComponent } from './plotting/sidenav_cards/floorplan_card.component';
import { DevicecardComponent } from './plotting/sidenav_cards/device_card.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './shared/services/auth.guard';
import { ToolbarComponent } from './plotting/sidenavmenu/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    UsersComponent,
    ReportsComponent,
    AdditemComponent,
    LoginComponent,
    PlottingComponent,
    SidenavmenuComponent,
    FloorplancardComponent,
    DevicecardComponent,
    SignUpComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonToggleModule
  ],
  entryComponents: [AdditemComponent],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
