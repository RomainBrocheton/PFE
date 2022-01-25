import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { SharingService } from '../_services/sharing.service';

const ZOOM_INIT = 3;
const ZOOM_IN = 12;
const ZOOM_MAX = 18;
const ZOOM_MIN = 3;

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

      if(this.lat != 0 && this.lon != 0)
        this.map.setZoom(ZOOM_IN);
    });
  }

  private initMap(){
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      zoom: ZOOM_INIT
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: ZOOM_MAX,
      minZoom: ZOOM_MIN
    });

    tiles.addTo(this.map);
  }

}
