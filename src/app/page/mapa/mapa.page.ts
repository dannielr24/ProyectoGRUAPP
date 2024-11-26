import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HistorialViajesService } from '../../services/historial-viajes.service';
import { Viaje } from '../models/viaje.model';

declare var google: any; // Declarar google para TypeScript

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map: any;
  vehicleType: string = '';
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  userLocation: { lat: number, lng: number } = { lat: 0, lng: 0 };
  destination: { lat: number, lng: number } = { lat: -33.4489, lng: -70.6693 }; // Santiago de Chile como ejemplo
  viajes: Viaje[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private historialService: HistorialViajesService
  ) {}

  ngOnInit() {
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.loadMap(); // Asegúrate de cargar el mapa después de obtener la ubicación del usuario
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
        }
      );
    }
  }

  loadMap() {
    console.log('Intentando inicializar el mapa...');

    if (typeof google === 'undefined') {
      console.error('La API de Google Maps no se cargó.');
      return;
    }

    const mapOptions = {
      zoom: 15,
      center: this.userLocation, // Centrar el mapa en la ubicación del usuario
      mapId: '6d85f3e1f153d7d2',
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
      console.log('Mapa inicializado correctamente.');
    } else {
      console.error('No se encontró el elemento del mapa.');
      return;
    }

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true
    });

    if (this.map) {
      this.addVehicleMarker(this.userLocation, 'auto');
      this.addVehicleMarker({ lat: -33.4489, lng: -70.6693 }, 'grúa');
      this.addVehicleMarker({ lat: -33.4569, lng: -70.6483 }, 'moto');

      // Añadir evento de clic en el mapa
      this.map.addListener('click', (event: any) => {
        const destination = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        this.calculateRoute(destination);
      });
    } else {
      console.error('El mapa no pudo inicializarse correctamente.');
    }
  }

  addVehicleMarker(location: { lat: number, lng: number }, vehicleType: string) {
    new google.maps.Marker({
      map: this.map,
      position: location,
      title: vehicleType === 'auto' ? 'Auto' : vehicleType === 'grúa' ? 'Grúa' : 'Moto',
      icon: {
        url: this.getVehicleIconUrl(vehicleType),
        scaledSize: new google.maps.Size(32, 32)
      }
    });
  }

  getVehicleIconUrl(vehicleType: string): string {
    switch (vehicleType) {
      case 'auto':
        return 'assets/img/uber-auto.jpg';
      case 'moto':
        return 'assets/img/uber-moto.jpg';
      case 'grúa':
        return 'assets/img/grua.jpg';
      default:
        return 'assets/img/default.jpg';
    }
  }

  calculateRoute(destination: { lat: number, lng: number }) {
    const request = {
      origin: this.userLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Error al calcular la ruta:', status);
      }
    });

    const viaje: Viaje = {
      origen: this.userLocation,
      destino: destination,
      tipo: this.vehicleType,
      fecha: new Date().toISOString(),
      estado: 'en curso',
    };

    this.historialService.addViaje(viaje);
    console.log('Viaje guardado en el historial:', viaje);
  }

  goBack() {
    this.location.back();
  }

  requestRide() {
    console.log('Solicitud de viaje iniciada');
  }

  selectVehicle(vehicleType: string) {
    this.vehicleType = vehicleType;
    console.log(`Selected vehicle: ${vehicleType}`);
  }
}