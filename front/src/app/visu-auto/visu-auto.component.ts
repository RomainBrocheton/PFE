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
      this.formChangeSub = this.ngForm.form.valueChanges.subscribe(x => {
        if(x.lat == undefined || x.lat == "")
          x.lat = 0;
        if(x.lon == undefined || x.lon == "")
          x.lon = 0;

        this.sharedService.nextMessage({lat: x.lat, lon: x.lon});
      });
      
      this.getRaws().then((success) => {
        if(!success)
          this.empty = true;
        else  
          this.cities = this.raws.map((v : any, i : any) => { return v.city; })
      });

  }

  display(f: NgForm){
    let v = {
      data: {},
      token: this.auth.getUser()
    };

    v.data = f.value;

    this.api.post('getGridFile', v).subscribe(res => {
      if(res.success)
        this.gridFile = res.result.lines;
      else
        alert('Une erreur est survenue');

      console.log(this.gridFile);

    });

    this.api.post('getColorFile', v).subscribe(res => {
      if(res.success)
        this.colorFile = res.lines;
      else
        alert('Une erreur est survenue');
      
      console.log(this.colorFile);

    });

    this.sharedService.nextMessage({lat: this.lat, lon: this.lon});
  }

  async getRaws(){
    return new Promise((resolve, reject) => {
      this.api.post('getCities', {
        token: this.auth.getUser()
      }).subscribe(res => {
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

  setCity(value : String){
    this.currentCity = value;
    this.periods = this.raws.filter((v : any) =>  v.city == value).map((v : any, i : any) => { return v.period; })

    this.api.post('getLocation', {city: this.currentCity, token: this.auth.getUser()}).subscribe(res => {
      this.lat = res.latitude;
      this.lon = res.longitude;

      this.sharedService.nextMessage({lat: this.lat, lon: this.lon});
    })
  }

  setPeriod(value : String){
    this.currentPeriod = value;
    this.granularities = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == value).map((v : any, i : any) => { return v.granularity; })
  }

  setGranularity(value : String){
    this.currentGranularity = value;
    this.seuils = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == value).map((v : any, i : any) => { return v.thresholdVehicule; })
  }

  setThresholdVehicule(value : String){
    this.currentSeuil = value;
    this.divisionsMin = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == value).map((v : any, i : any) => { return v.timeDivisionStart; })
  }

  setDivisionMin(value : String){
    this.currentDivisionMin = value;
    this.divisionsMax = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == this.currentSeuil && v.timeDivisionStart == value).map((v : any, i : any) => { return v.timeDivisionEnd; })
  }

  setDivisionMax(value : String){
    this.currentDivisionMax = value;
    this.directions = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == this.currentSeuil && v.timeDivisionStart == this.currentDivisionMin && v.timeDivisionEnd == value).map((v : any, i : any) => { return v.direction; })
  }

  setDirection(value : String){
    this.currentDirection = value;
    this.authors = this.raws.filter((v : any) =>  v.city == this.currentCity && v.period == this.currentPeriod && v.granularity == this.currentGranularity && v.thresholdVehicule == this.currentSeuil && v.timeDivisionStart == this.currentDivisionMin && v.timeDivisionEnd == this.currentDivisionMax && v.direction == value).map((v : any, i : any) => { return v.author; })
  }
}
