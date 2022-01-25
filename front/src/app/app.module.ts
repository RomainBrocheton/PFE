import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './_shared/sidebar/sidebar.component';
import { MapComponent } from './map/map.component';
import { VisuAutoComponent } from './visu-auto/visu-auto.component';
import { HomepageComponent } from './homepage/homepage.component';
import { VisuManuComponent } from './visu-manu/visu-manu.component';
import { InsertManuComponent } from './insert-manu/insert-manu.component';
import { InsertAutoComponent } from './insert-auto/insert-auto.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MapComponent,
    VisuAutoComponent,
    HomepageComponent,
    VisuManuComponent,
    InsertManuComponent,
    InsertAutoComponent,
    ConnexionComponent,
    InscriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
