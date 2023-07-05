import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {NgSelectizeModule} from "ng-selectize";
import {FormsModule} from "@angular/forms";
import { NgxSmartModalModule } from 'ngx-smart-modal';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    HttpClientModule,
    NgSelectizeModule,
    FormsModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
