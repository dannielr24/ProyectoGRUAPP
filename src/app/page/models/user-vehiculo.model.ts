export class UserVehiculo {
    id_vehiculo: number;
    id_usuario: number;
    patente: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    tipo_combustible: string;
  
    constructor(data?: Partial<UserVehiculo>) {
      this.id_vehiculo = data?.id_vehiculo || 0;
      this.id_usuario = data?.id_usuario || 0;
      this.patente = data?.patente || '';
      this.marca = data?.marca || '';
      this.modelo = data?.modelo || '';
      this.anio = data?.anio || new Date().getFullYear(); // Valor por defecto
      this.color = data?.color || '';
      this.tipo_combustible = data?.tipo_combustible || '';
    }
  }
  