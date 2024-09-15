import { Component, OnInit } from '@angular/core';

declare var google: any;  // Declarar google para TypeScript

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map: any;

  constructor() {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    let latLng = new google.maps.LatLng(-33.4489, -70.6693); // Cambia por tu latitud y longitud.

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
}

