import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.service';
import { SharingService } from '../_services/sharing.service';

@Component({
  selector: 'app-visu-auto',
  templateUrl: './visu-auto.component.html',
  styleUrls: ['./visu-auto.component.scss']
})
export class VisuAutoComponent implements OnInit {
  @ViewChild('f', {static: true}) ngForm : NgForm | undefined ;
  formChangeSub : any;

  raws : any = [];
  cities : any = [];
  periods : any = [];
  granularities : any = [];
  seuils : any = [];
  divisionsMin : any = [];
  divisionsMax : any = [];
  directions : any = [];
  authors : any = [];

  empty = false;

  currentCity : String = "";
  currentPeriod : String = "";
  currentGranularity : String = "";
  currentSeuil : String = "";
  currentDivisionMin : String = "";
  currentDivisionMax : String = "";
  currentDirection : String = "";

  gridFile : any = [];
  colorFile : any = [];

  lat : any = ''; 
  lon : any = '';

  constructor(private sharedService : SharingService, private api : ApiService, private auth : AuthService) { }

  async ngOnInit(): Promise<void> {
    if(this.ngForm != undefined)
      this.formChangeSub = this.ngForm.form.valueChanges.subscribe(x => { // lorsqu'un champ du formulaire est modifié
        if(x.lat == undefined || x.lat == "")
          x.lat = 0;
        if(x.lon == undefined || x.lon == "")
          x.lon = 0;

        this.sharedService.nextMessage({lat: x.lat, lon: x.lon}); // on envoie a la carte la nouvelle position
      });
      
      this.getRaws().then((success) => {  // on récupère les villes à afficher
        if(!success)
          this.empty = true;
        else  
          this.cities = this.raws.map((v : any, i : any) => { return v.city; })
      });
  }

  // au submit
  display(f: NgForm){
    let v = {
      data: {},
      token: this.auth.getUser()
    };

    v.data = f.value;
    let self = this;

    let myGriFile = function getGridFile(){
      return new Promise((resolve, reject) => {
        self.api.post('getGridFile', v).subscribe(res => {
          if(res.success){
            self.gridFile = res.result.lines;
            resolve("OK");
          }
          else {
            alert('Une erreur est survenue');
            reject("NOK");
          }
        });
      });
    }
    
    let myColorFile = function getColorFile(){
      return new Promise((resolve, reject) => {
        self.api.post('getColorFile', v).subscribe(res => {
          if(res.success){
            self.colorFile = res.lines;
            resolve("OK");
          } else {
            alert('Une erreur est survenue');
            reject("NOK");
          }    
        });
      });
    }

    // On attend que la récupération des fichiers grid et color dans la BDD soit terminée avant de les envoyer au composant map pour qu'il s'occupe de l'affichage
    myGriFile()
    .then(() => myColorFile())
    .then(() => {
      this.sharedService.nextMessage({lat: this.lat, lon: this.lon, grid: this.gridFile, color: this.colorFile}); // on envoie à la map
    }).catch((error) => {
      console.log("Une erreur est survenue : " + error);
      console.log("this.gridFile : " + this.gridFile);
      console.log("this.colorFile : " + this.colorFile);
    });
  }

  timeoutCrash(){ // en cas de non réponse de l'API
    alert('Impossible de récupérer les informations depuis notre API 😥');
    console.error('Notre API n a pas répondu à temps.')
  }

  async getRaws(){
    let x = setTimeout(() => {
      this.timeoutCrash();
    }, 10000);

    return new Promise((resolve, reject) => {
      this.api.post('getCities', {
        token: this.auth.getUser()
      }).subscribe(res => {
        clearTimeout(x);  // si réponse, on clear le timeout (il s'affichera qu'en cas de non réponse)

        if(res.cities){
          this.raws = res.cities;
          console.log("RAWS : ", this.raws);
          resolve(true);
        }
        else
          resolve(false);
      });
    });
  }

  setCity(value : String){  // ville choisie, on filtre les périodes
    this.currentCity = value;
    this.periods = this.raws.filter((v : any) =>  v.city == value).map((v : any, i : any) => { return v.period; })

    this.api.post('getLocation', {city: this.currentCity, token: this.auth.getUser()}).subscribe(res => {
      this.lat = res.latitude;
      this.lon = res.longitude;

      this.sharedService.nextMessage({lat: this.lat, lon: this.lon});
    })
  }

  setPeriod(value : String){  // periode choisie, on filtre les granularités
    this.currentPeriod = value;
    this.granularities = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == value).map((v : any, i : any) => { return v.granularity; })
  }

  setGranularity(value : String){ // granularité choisie, on filtre les seuils
    this.currentGranularity = value;
    this.seuils = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == value).map((v : any, i : any) => { return v.thresholdVehicule; })
  }

  setThresholdVehicule(value : String){ // seuil choisi, on filtre les divisions min
    this.currentSeuil = value;
    this.divisionsMin = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == value).map((v : any, i : any) => { return v.timeDivisionStart; })
  }

  setDivisionMin(value : String){ // division min choisie, on filtre les divisions max
    this.currentDivisionMin = value;
    this.divisionsMax = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == this.currentSeuil && v.timeDivisionStart == value).map((v : any, i : any) => { return v.timeDivisionEnd; })
  }

  setDivisionMax(value : String){ // division max choisie, on filtre les directions
    this.currentDivisionMax = value;
    this.directions = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == this.currentSeuil && v.timeDivisionStart == this.currentDivisionMin && v.timeDivisionEnd == value).map((v : any, i : any) => { return v.direction; })
  }

  setDirection(value : String){ // direction choisie, on filtre les auterus
    this.currentDirection = value;
    this.authors = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == this.currentSeuil && v.timeDivisionStart == this.currentDivisionMin && v.timeDivisionEnd == this.currentDivisionMax && v.direction == value).map((v : any, i : any) => { return v.author; })
  }
}
