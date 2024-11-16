// viaje.model.ts
export interface Viaje {
  destino: { lat: number, lng: number };  
  tipo: string;  
  fecha: string; 
  origen: { lat: number, lng: number }; 
  estado: string;  
}

  