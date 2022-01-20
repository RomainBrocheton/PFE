import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { SharingService } from '../_services/sharing.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() lat = 0;
  @Input() lon = 0;

  private map : any;

  constructor(private sharedService : SharingService) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.sharedService.sharedMessage.subscribe((data) => {
      this.lat = data.lat;
      this.lon = data.lon;
      this.map.panTo(new L.LatLng(this.lat, this.lon));
    });
  }

  private initMap(){
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      zoom: 7
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3
    });

    tiles.addTo(this.map);
  }

}
