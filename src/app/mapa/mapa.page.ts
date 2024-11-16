import { Component, OnInit } from '@angular/core';

declare var google: any;

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
    const mapOptions = {
      zoom: 15,
      center: { lat: -33.456, lng: -70.648 },
      mapId: '7d8884afd62f26fc',
      disableDefaultUI: true,
      zoomControl: true,
    };

    const mapElement = document.getElementById('map');

    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);

      // Verifica si la geolocalización está disponible
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            // Centrar el mapa en la ubicación del usuario
            this.map.setCenter(userLocation);

            // Agregar un marcador en la ubicación del usuario
            new google.maps.Marker({
              position: userLocation,
              map: this.map,
              title: 'Tu ubicación',
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Ícono del marcador
              },
            });
          },
          (error) => {
            console.error('Error obteniendo la ubicación:', error);
            alert('No se pudo obtener tu ubicación. Verifica los permisos.');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
          }
        );
      } else {
        console.error('La geolocalización no está soportada por este navegador.');
      }
    } else {
      console.error('No se encontró el elemento del mapa.');
    }
  }
}
