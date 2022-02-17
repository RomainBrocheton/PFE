import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharingService } from '../_services/sharing.service';

@Component({
  selector: 'app-visu-manu',
  templateUrl: './visu-manu.component.html',
  styleUrls: ['./visu-manu.component.scss']
})
export class VisuManuComponent implements OnInit {

  @ViewChild('f', {static: true}) ngForm : NgForm | undefined ;
  formChangeSub : any;
  gridFile: File | null = null;
  colorFile: File | null = null;

  constructor(private sharedService : SharingService) { }

  ngOnInit(): void {
    if(this.ngForm != undefined)
      this.formChangeSub = this.ngForm.form.valueChanges.subscribe(x => {
        if(x.lat == undefined || x.lat == "")
          x.lat = 0;
        if(x.lon == undefined || x.lon == "")
          x.lon = 0;

        this.sharedService.nextMessage({lat: x.lat, lon: x.lon});
      });
  }

  display(f: NgForm){
    // TODO
    // Le problème semble venir des fichiers qui ne sont pas lus par le formulaire, il récupère juste le path
    // Je dois trouver un moyen de récupérer les fichiers eux-mêmes.

    // if(f.value.grid && f.value.color)
    if(this.gridFile && this.colorFile)
    {
      // this.gridFile = f.value.grid;
      // this.colorFile = f.value.color;
      // console.log("f.value.grid : " + f.value.grid);
      // console.log("f.value.color : " + f.value.color);
      let file;
      let GridLines;
      let ColorLines;
      for(let i=0;i<2;i++){

        if(i = 0){
          file = this.gridFile;
          // file = f.value.grid;
        } else {
          file = this.colorFile;
          // file = f.value.color;
        }
      
        // On instancie un FileReader pour récupérer le contenu du fichier
        let reader = new FileReader();
        reader.readAsText(file as Blob, "UTF-8");

        // En cas de succès de lecture du fichier
        reader.onload = function ( fileRead ) {
          
          // On récupère le fichier ligne par ligne dans un tableau
          if( i = 0)
          {
            // @ts-ignore
            gridLines = fileRead.target.result.split("\n");
          } else {
            // @ts-ignore
            colorLines = fileRead.target.result.split('\n');
          }
        }

        // En cas d'echec de lecture du fichier
        reader.onerror = function ( e ) {

          // MESSAGE ERREUR ?
          console.log("Erreur dans la lecture des fichiers");
        }
        
        this.sharedService.nextMessage({lat: f.value.lat, lon: f.value.lon, grid: GridLines, color: ColorLines});
      }
    }
  }

  handleGridFile(gridFile: FileList){
    this.gridFile = gridFile.item(0);
    console.log("GridFile : " + this.gridFile);
  }

  handleColorFile(colorFile: FileList){
    this.colorFile = colorFile.item(0);
    console.log("ColorFile : " + this.colorFile);
  }

}
