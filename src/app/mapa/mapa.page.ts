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
    private historialService: HistorialViajesService
  ) {}

  ngOnInit() {
    this.getUserLocation();
    // Llama a loadMap aquí si necesitas que el mapa se cargue inmediatamente
    this.loadMap();
  }
  

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.calculateRoute(this.destination);
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
      return; // Salir de la función si la API no se cargó
    }
  
    const mapOptions = {
      zoom: 15,
      center: { lat: -33.4489, lng: -70.6693 },
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
      console.log('Mapa inicializado correctamente.');
    } else {
      console.error('No se encontró el elemento del mapa.');
      return; // Salir de la función si no se encuentra el elemento del mapa
    }
  
    // Inicializar DirectionsService y DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true
    });
  
    // Verificar que el mapa esté correctamente inicializado antes de agregar marcadores
    if (this.map) {
      this.addVehicleMarker(this.userLocation, 'auto'); // Usar tipo 'auto' o 'grúa' según corresponda
      this.addVehicleMarker({ lat: -33.4489, lng: -70.6693 }, 'grúa'); // Ubicación de ejemplo para la grúa (Santiago, Chile)
      this.addVehicleMarker({ lat: -33.4569, lng: -70.6483 }, 'moto'); // Ubicación de ejemplo para la moto (Santiago, Chile)
    } else {
      console.error('El mapa no pudo inicializarse correctamente.');
    }
  }
  
  // Función para agregar marcador de vehículo
  addVehicleMarker(location: { lat: number, lng: number }, vehicleType: string) {
    new google.maps.Marker({
      map: this.map,
      position: location,
      title: vehicleType === 'auto' ? 'Auto' : vehicleType === 'grúa' ? 'Grúa' : 'Moto',
      icon: {
        url: this.getVehicleIconUrl(vehicleType), // Obtener la URL del icono del vehículo
        scaledSize: new google.maps.Size(32, 32) // Tamaño del icono
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
    // Aquí puedes integrar Google Maps o cualquier otra API para calcular la ruta,
    // pero por ahora solo vamos a simular el cálculo de la ruta.

    // Crear el objeto Viaje con los detalles del viaje
    const viaje: Viaje = {
      origen: this.userLocation,
      destino: destination,
      tipo: this.vehicleType,  // Puede ser 'auto', 'moto', 'grúa', etc.
      fecha: new Date().toISOString(),  // Fecha del viaje en formato ISO
      estado: 'en curso',  // El viaje está en curso mientras se realiza
    };

    // Guardar el viaje en el historial de viajes
    this.historialService.addViaje(viaje);
    console.log('Viaje guardado en el historial:', viaje);
  }

  goBack() {
    this.location.back(); // Navega a la página anterior
  }

  requestRide() {
    console.log('Solicitud de viaje iniciada');
    // Lógica para manejar la solicitud de viaje
  }

  // Define the selectVehicle method here
  selectVehicle(vehicleType: string) {
    // Implement the logic for selecting a vehicle based on vehicleType
    console.log(`Selected vehicle: ${vehicleType}`); // Example usage
  }
}
