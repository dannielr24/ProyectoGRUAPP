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
    const mapElement = document.getElementById('map');

    if (mapElement) {
      const latLng = new google.maps.latLng(-33.4489, -70.6693);

      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.mapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(mapElement, mapOptions);
    } else {
      console.error('No se pudo encontrar el elemento para el mapa');
    }
  }
}

