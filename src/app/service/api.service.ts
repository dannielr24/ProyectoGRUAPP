//api.service.ts
import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpHeaders, 
  HttpErrorResponse,
} from '@angular/common/http';
import { retry, catchError, throwError } from 'rxjs';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Asegúrate de que la ruta sea correcta
import { UserModel } from '../page/models/user.model';
import { idTokenResult } from '@angular/fire/compat/auth-guard';
import { IMAGE_CONFIG } from '@angular/common';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  apiUrl = 'http://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(this.apiUrl + '/posts').pipe(retry(3));
  }

  getPost(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/posts' + id).pipe(retry(3));
  }

  createPost(post: any): Observable<any> {
    return this.http
      .post(this.apiUrl + '/posts', post, this.httpOptions)
      .pipe(retry(3));
  }

  updatePost(id: any, post: any) {
    return this.http.delete(this.apiUrl + '/posts' + id, this.httpOptions);
  }

  deletePost(id: any): Observable<any> {
    return this.http.delete(this.apiUrl + '/posts' + id, this.httpOptions);
  }

  async agregarUsuario(data: bodyUser, imageFile: File) {
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
      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl + 'user/agregar', formData).pipe(timeout(10000))
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async agregarVehiculo(data: any, imageFile: File | null) {
    try {
      // Verificar que el ID de usuario sea válido
      if (!data.p_id_usuario || (typeof data.p_id_usuario !== 'string' && isNaN(data.p_id_usuario))) {
        console.error('ID de usuario inválido:', data.p_id_usuario);
        alert('El ID de usuario no es válido. Por favor, verifique los datos.');
        return;
      }      
  
      // Crear un FormData para enviar los datos al servidor
      const formData = new FormData();
      formData.append('p_id_usuario', data.p_id_usuario.toString()); // Asegúrate de que es una cadena de texto
      formData.append('p_patente', data.p_patente);
      formData.append('p_marca', data.p_marca);
      formData.append('p_modelo', data.p_modelo);
      formData.append('p_anio', data.p_anio.toString());
      formData.append('p_color', data.p_color);
      formData.append('p_tipo_combustible', data.p_tipo_combustible);
  
      // Verificar los datos antes de enviarlos
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
  
      if (data.token) {
        formData.append('token', data.token);
      }
  
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
      }
  
      // Realizar la solicitud POST al backend
      const response = await lastValueFrom(
        this.http.post<any>(`${environment.apiUrl}/vehiculo/agregar`, formData).pipe(
          timeout(10000),
          retry(3),  // Intentar 3 veces si la primera solicitud falla
          catchError((error: HttpErrorResponse) => {
            console.error('Detalles del error:', error);
            if (error.status === 500) {
              alert('Hubo un problema al registrar el vehículo. Por favor, intente más tarde.');
            } else {
              alert('Ocurrió un error desconocido. Intente nuevamente.');
            }
            return throwError(() => new Error(error.message || 'Error desconocido'));
          })
        )
      );
  
      // Mostrar la respuesta de la API
      console.log('Respuesta de la API:', response);
      if (response && response.success) {
        alert('Vehículo registrado correctamente!');
      }
  
      return response;
  
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      alert('Ocurrió un error al agregar el vehículo. Intente nuevamente.');
      throw error;
    }
  }  
  
  // Método para manejar errores de la API
  private handleError(error: HttpErrorResponse) {
    console.error('Detalles del error:', error);
    if (error.status === 500) {
      alert('Hubo un problema al registrar el vehículo. Por favor, intente más tarde.');
    } else {
      alert('Ocurrió un error desconocido. Intente nuevamente.');
    }
    return throwError(() => new Error(error.message || 'Error desconocido'));
  }

  async obtenerUsuario(data: dataGetUser): Promise<UserModel[]> {
    try {
      const params = {
        p_correo: data.p_correo,
        token: data.token
      };
      const response = await lastValueFrom(this.http.get<any>(`${environment.apiUrl}/user/obtener`, { params }));
      return response.data; 
    } catch (error) {
      throw error;
    }
  }

  async agregarViaje(data: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('p_id_usuario', data.p_id_usuario.toString());
      formData.append('p_ubicacion_origen', data.p_ubicacion_origen);
      formData.append('p_ubicacion_destino', data.p_ubicacion_destino);
      formData.append('p_costo', data.p_costo.toString());
      formData.append('p_id_vehiculo', data.p_id_vehiculo.toString());
      formData.append('token', data.token);
  
      const response = await lastValueFrom(
        this.http.post<any>(`${environment.apiUrl}/viaje/agregar`, formData).pipe(
          timeout(10000),
          retry(3),
          catchError((error: HttpErrorResponse) => {
            console.error('Error al agregar viaje:', error);
            return throwError(() => new Error(error.message || 'Error desconocido al agregar viaje.'));
          })
        )
      );
      return response;
    } catch (error) {
      console.error('Error en agregarViaje:', error);
      throw error;
    }
  }
  
  async obtenerViaje(p_id: number | null, p_id_usuario: number | null, token: string): Promise<any> {
    try {
      const params: any = { token };
      if (p_id) params.p_id = p_id;
      if (p_id_usuario) params.p_id_usuario = p_id_usuario;
  
      const response = await lastValueFrom(
        this.http.get<any>(`${environment.apiUrl}/viaje/obtener`, { params }).pipe(
          timeout(10000),
          retry(3),
          catchError((error: HttpErrorResponse) => {
            console.error('Error al obtener viaje:', error);
            return throwError(() => new Error(error.message || 'Error desconocido al obtener viaje.'));
          })
        )
      );
      return response;
    } catch (error) {
      console.error('Error en obtenerViaje:', error);
      throw error;
    }
  }
}

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
  token: string | null;
}

