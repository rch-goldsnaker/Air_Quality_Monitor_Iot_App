import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {SharedModule} from '../app/components/shared/shared.module'
import {HttpClientModule} from '@angular/common/http';
import { TableComponent } from './components/table/table.component';
import { NavbarComponent } from './components/navbar/navbar.component'
import { FormsModule } from '@angular/forms';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    NavbarComponent,
    DialogInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
