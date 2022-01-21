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
    this.sharedService.nextMessage({lat: f.value.lat, lon: f.value.lon});
  }

}
