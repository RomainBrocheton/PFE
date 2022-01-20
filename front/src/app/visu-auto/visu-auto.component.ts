import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharingService } from '../_services/sharing.service';

@Component({
  selector: 'app-visu-auto',
  templateUrl: './visu-auto.component.html',
  styleUrls: ['./visu-auto.component.scss']
})
export class VisuAutoComponent implements OnInit {

  constructor(private sharedService : SharingService) { }

  ngOnInit(): void {
  }

  display(f: NgForm){
    this.sharedService.nextMessage({lat: f.value.lat, lon: f.value.lon});
  }

  focusout(event : any){
    console.log(event);
  }

}
