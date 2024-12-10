import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpHeaders, 
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { retry, catchError, throwError } from 'rxjs';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../page/models/user.model';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json'),
    withCredentials: false  // Añadido esta línea
  };

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  private getFormDataHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  async agregarUsuario(data: bodyUser, imageFile?: File | null) {
    try {
      const formData = new FormData();
      formData.append('p_nombre', data.p_nombre);
      formData.append('p_correo_electronico', data.p_correo_electronico);
      formData.append('p_telefono', data.p_telefono);
      if (data.token) {
        formData.append('token', data.token);
      }
      if (imageFile) {
        formData.append('image_usuario', imageFile, imageFile.name);
      }

      const headers = this.getAuthHeaders(data.token || '');
      console.log('Enviando datos de usuario:', data);
      
      const response = await lastValueFrom(
        this.http.post<any>(`${environment.apiUrl}user/agregar`, formData, {
          headers: headers
        })
      );
      
      console.log('Respuesta de agregarUsuario:', response);
      return response;
    } catch(error) {
      console.error('Error en agregarUsuario:', error);
      throw error;
    }
  }

  async agregarVehiculo(data: bodyVehiculo, imageFile: File) {
    try {
      const formData = new FormData();
      
      formData.append('p_id_usuario', data.p_id_usuario.toString());
      formData.append('p_patente', data.p_patente);
      formData.append('p_marca', data.p_marca);
      formData.append('p_modelo', data.p_modelo);
      formData.append('p_anio', data.p_anio.toString());
      formData.append('p_color', data.p_color);
      formData.append('p_tipo_combustible', data.p_tipo_combustible);
      
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
      }
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${data.token}`
      });
  
      // Log simplificado sin usar entries()
      console.log('Enviando datos del vehículo:', {
        ...data,
        imageFile: imageFile?.name
      });
  
      const response = await lastValueFrom(
        this.http.post<any>(`${environment.apiUrl}vehiculo/agregar`, formData, {
          headers,
          withCredentials: false
        }).pipe(
          timeout(30000),
          catchError(error => {
            console.error('Error en agregarVehiculo:', error);
            throw error;
          })
        )
      );
  
      return response;
    } catch (error) {
      console.error('Error en agregarVehiculo:', error);
      throw error;
    }
  }

  async obtenerUsuario(data: dataGetUser): Promise<UserModel[]> {
    try {
      console.log('Enviando solicitud obtenerUsuario con:', data);
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${data.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });

      const params = new HttpParams().set('p_correo', data.p_correo);

      const response = await lastValueFrom(
        this.http.get<any>(`${environment.apiUrl}user/obtener`, {
          headers,
          params,
          withCredentials: false // Asegúrate que esto esté en false
        }).pipe(
          timeout(30000),
          catchError(error => {
            console.error('Error en obtenerUsuario:', error);
            throw error;
          })
        )
      );

      console.log('Respuesta de obtenerUsuario:', response);
      return response?.data || [];
    } catch (error) {
      console.error('Error en obtenerUsuario:', error);
      throw error;
    }
}

  async obtenerVehiculo(data: { p_id: number; token: string }) {
    try {
      const headers = this.getAuthHeaders(data.token);
      
      const response = await lastValueFrom(
        this.http.get<any>(`${environment.apiUrl}vehiculo/obtener`, { 
          params: { p_id: data.p_id.toString() },
          headers: headers
        })
      );
      return response;
    } catch (error) {
      console.error("Error en obtenerVehiculo:", error);
      throw error;
    }
  }

  async agregarViaje(data: bodyViaje) {
    try {
      const headers = this.getAuthHeaders(data.token);
      const response = await lastValueFrom(
        this.http.post<any>(`${environment.apiUrl}viaje/agregar`, data, {
          headers: headers
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async obtenerViaje(data: dataGetViaje) {
    try {
      const headers = this.getAuthHeaders(data.token);
      const response = await lastValueFrom(
        this.http.get<any>(`${environment.apiUrl}viaje/obtener`, { 
          params: { p_id_usuario: data.p_id_usuario.toString() },
          headers: headers
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async actualizarViaje(data: bodyActViaje) {
    try {
      const headers = this.getAuthHeaders(data.token);
      const response = await lastValueFrom(
        this.http.post<any>(`${environment.apiUrl}viaje/actualizar_estado_viaje`, data, {
          headers: headers
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error completo:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud'));
  }
}

// Mantener las interfaces como están

interface bodyUser {
  p_nombre: string;
  p_correo_electronico: string;
  p_telefono: string;
  token?: string;
}

interface dataGetUser {
  p_correo: string;
  token: string;
}

interface bodyVehiculo {
  p_id_usuario: number;
  p_patente: string;
  p_marca: string;
  p_modelo: string;
  p_anio: number;
  p_color: string;
  p_tipo_combustible: string;
  token: string;
}

interface dataGetVehiculo {
  p_id: number;
  token: string;
}

interface bodyViaje {
  p_id_usuario: number;
  p_ubicacion_origen: string;
  p_ubicacion_destino: string;
  p_costo: number;
  p_id_vehiculo: number;
  token: string;
}

interface dataGetViaje {
  p_id_usuario: number;
  token: string;
}

interface bodyActViaje {
  p_id_estado: number;
  p_id: number;
  token: string;
}
