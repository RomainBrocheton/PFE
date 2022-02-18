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

    if(this.gridFile && this.colorFile)
    {
      let file;
      // @ts-ignore
      let gridLines;
      // @ts-ignore
      let colorLines;
      let self = this;

      for(let i=0;i<2;i++){

        if(i < 1){
          file = this.gridFile;
        } else {
          file = this.colorFile;
        }
      
        // On instancie un FileReader pour récupérer le contenu du fichier
        let reader: FileReader = new FileReader();
        reader.readAsBinaryString(file);

        // En cas de succès de lecture du fichier
        reader.onload = function () {
          
          // On récupère le fichier ligne par ligne dans un tableau
          if(i < 1)
          {
            // @ts-ignore
            gridLines = reader.result.split("\n");
            // @ts-ignore
            self.sharedService.nextMessage({lat: f.value.lat, lon: f.value.lon, grid: gridLines, color: colorLines});
          } else {
            // @ts-ignore
            colorLines = reader.result.split('\n');
          }
        }

        // En cas d'echec de lecture du fichier
        reader.onerror = function ( e ) {

          // MESSAGE ERREUR ?
          console.log("Erreur dans la lecture des fichiers");
        }        
      }
    }
  }

  handleGridFile(event : any){
    this.gridFile = event.target.files[0];
  }

  handleColorFile(event : any){
    this.colorFile = event.target.files[0];
  }

}
