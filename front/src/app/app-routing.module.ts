import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { DeconnexionComponent } from './deconnexion/deconnexion.component';
import { HomepageComponent } from './homepage/homepage.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { InsertAutoComponent } from './insert-auto/insert-auto.component';
import { InsertManuComponent } from './insert-manu/insert-manu.component';
import { VisuAutoComponent } from './visu-auto/visu-auto.component';
import { VisuManuComponent } from './visu-manu/visu-manu.component';

const routes: Routes = [
  { 
    path: '', component: HomepageComponent, children: [
      { path: '', component: VisuManuComponent },
      { path: 'visu', component: VisuManuComponent },
      { path: 'visu/automatique', component: VisuAutoComponent },
      { path: 'visu/manuelle', component: VisuManuComponent },
      { path: 'insert', component: InsertAutoComponent },
      { path: 'insert/automatique', component: InsertAutoComponent },
      { path: 'insert/manuelle', component: InsertManuComponent },
      { path: 'connexion', component: ConnexionComponent },
      { path: 'inscription', component: InscriptionComponent },
      { path: 'deconnexion', component: DeconnexionComponent }
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
