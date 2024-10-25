import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from 'leaflet';

declare var google: any;  // Declarar google para TypeScript

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map: any;
  vehicleType: string = '';

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true 
      });

    let latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude); // Cambia por tu latitud y longitud.

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: "Tu ubicación",
    });
  } catch(error) {
    console.error('Error obteniendo la ubicación', error);
  }
}

selectVehicle(type: string) {
  this.vehicleType = type;
}

  requestRide() {
    if (this.vehicleType) {
      console.log('Viaje solicitado en ${this.vehicleType}');
    } else {
      console.error('Por favor, seleccione un tipo de vehiculo');
    }
  }

  goToAccount(page: string) {
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }
}
