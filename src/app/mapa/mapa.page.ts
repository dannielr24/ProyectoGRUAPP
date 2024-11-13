import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

  loadMap() {
    if (typeof google === 'undefined') {
      console.error('Google Maps API no está cargada.');
      return;
    }

    // Configuración del mapa
    const mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    };

    const mapElement = document.getElementById('map');

    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);

      // Geolocalización usando navigator.geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            // Centrar el mapa en la ubicación del usuario
            this.map.setCenter(userLocation);

            // Añadir marcador en la ubicación del usuario
            new google.maps.Marker({
              position: userLocation,
              map: this.map,
              title: 'Tu Ubicación',
            });
          },
          (error) => {
            console.error('Error obteniendo la ubicación:', error);
            alert('No se pudo obtener la ubicación. Verifica los permisos.');
          },
          {
            enableHighAccuracy: true,  // Solicitar alta precisión
            timeout: 10000,            // Tiempo máximo de espera
          }
        );
      } else {
        console.error('La geolocalización no está soportada por este navegador.');
      }
    } else {
      console.error('No se encontró el elemento del mapa en el DOM.');
    }
  }

  selectVehicle(type: string) {
    this.vehicleType = type;
  }

  requestRide() {
    if (this.vehicleType) {
      console.log(`Viaje solicitado en ${this.vehicleType}`);
    } else {
      console.error('Por favor, seleccione un tipo de vehículo');
    }
  }

  goToAccount(page: string) {
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }
}
