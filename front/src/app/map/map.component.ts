import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() lat = 0;
  @Input() lon = 0;

  private map : any;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(){
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3
    });

    tiles.addTo(this.map);
  }

}
