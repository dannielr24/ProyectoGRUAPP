import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HistorialViajesService } from '../services/historial-viajes.service';
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
    private historialService: HistorialViajesService,
  ) {}

  ngOnInit() {
    this.getUserLocation();
    // Inicializar DirectionsService y DirectionsRenderer aquí
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  // Método para seleccionar el vehículo
  selectVehicle(vehicleType: string) {
    this.vehicleType = vehicleType;  // Guardar el tipo de vehículo seleccionado
    
    // Establecer un destino según el tipo de vehículo
    switch (vehicleType) {
      case 'auto':
        this.destination = { lat: -33.4489, lng: -70.6693 }; // Coordenadas de ejemplo para un auto
        break;
      case 'moto':
        this.destination = { lat: -33.4569, lng: -70.6483 }; // Coordenadas para una moto
        break;
      case 'grúa':
        this.destination = { lat: -33.4700, lng: -70.7000 }; // Coordenadas para una grúa
        break;
      default:
        this.destination = { lat: -33.4489, lng: -70.6693 }; // Coordenada por defecto
        break;
    }

    // Llamar a la función para recalcular la ruta con el nuevo destino
    this.calculateRoute(this.destination);
  }  

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.loadMap();
      });
    } else {
      console.error('La geolocalización no está disponible');
    }
  }  

  loadMap() {
    if (typeof google === 'undefined') {
      console.error('Google Maps API no está cargada.');
      return;
    }
  
    const mapOptions = {
      zoom: 15,
      center: this.userLocation,
      mapId: '6d85f3e1f153d7d2', // ID de mapa personalizado
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
    }
  
    // Inicializar DirectionsService y DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true
    });
  
    // Crear marcador del vehículo
    this.addVehicleMarker(this.userLocation, 'auto'); // Usar tipo 'auto' o 'grúa' según corresponda
    this.addVehicleMarker({ lat: -33.4489, lng: -70.6693 }, 'grúa'); // Ubicación de ejemplo para la grúa (Santiago, Chile)
    this.addVehicleMarker({ lat: -33.4569, lng: -70.6483 }, 'moto'); // Ubicación de ejemplo para la moto (Santiago, Chile)
  }
  
  // Función para agregar marcador de vehículo
  addVehicleMarker(location: { lat: number, lng: number }, vehicleType: string) {
    const markerIcon = document.createElement('img');
    markerIcon.src = this.getVehicleIconUrl(vehicleType);
    markerIcon.style.width = '32px'; // Tamaño del icono del marcador
    markerIcon.style.height = '32px';
  
    new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      position: location,
      title: vehicleType === 'auto' ? 'Auto' : vehicleType === 'grúa' ? 'Grúa' : 'Moto',
      content: markerIcon
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

  // Método para calcular la ruta
  calculateRoute(destination: { lat: number, lng: number }) {
    console.log('Calculando ruta...');
    console.log('Origen:', this.userLocation);
    console.log('Destino:', destination);

    // Asegúrate de que directionsService y directionsRenderer estén inicializados
    if (this.directionsService && this.directionsRenderer) {
      const request = {
        origin: this.userLocation, // La ubicación actual del usuario
        destination: destination,  // El destino del viaje
        travelMode: google.maps.TravelMode.DRIVING, // O el modo de transporte que desees
      };

      this.directionsService.route(request, (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log('Ruta calculada correctamente', result);
          this.directionsRenderer.setDirections(result); // Renderizar la ruta en el mapa
        } else {
          console.error('Error al calcular la ruta:', status);
        }
      });
    } else {
      console.error('directionsService o directionsRenderer no están inicializados');
    }
  }

  goBack() {
    this.location.back(); // Navega a la página anterior
  }

  requestRide() {
    console.log('Solicitud de viaje iniciada');
    // Lógica para manejar la solicitud de viaje
  }
}
