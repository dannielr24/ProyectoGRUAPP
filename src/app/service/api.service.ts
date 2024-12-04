import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpHeaders, 
  HttpErrorResponse,
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
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  apiUrl = 'http://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(this.apiUrl + '/posts').pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getPost(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/posts' + id).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  createPost(post: any): Observable<any> {
    return this.http
      .post(this.apiUrl + '/posts', post, this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  updatePost(id: any, post: any) {
    return this.http.delete(this.apiUrl + '/posts' + id, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deletePost(id: any): Observable<any> {
    return this.http.delete(this.apiUrl + '/posts' + id, this.httpOptions).pipe(
      catchError(this.handleError)
    );
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
        this.http.post<any>(environment.apiUrl + 'user/agregar', formData).pipe(
          timeout(10000),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      this.handleError(error);
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
      if (data.token) {
        formData.append('token', data.token);
      }
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
      }

      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl + 'vehiculo/obtener', formData).pipe(
          timeout(10000),
          retry(3),
          catchError(this.handleError)
        )
      );
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }  

  private handleError(error: any) {
    // Verifica si el error es una instancia de HttpErrorResponse
    if (error instanceof HttpErrorResponse) {
      console.error('Detalles del error:', error);
      if (error.status === 500) {
        alert('Hubo un problema al registrar el vehículo. Por favor, intente más tarde.');
      } else {
        alert('Ocurrió un error desconocido. Intente nuevamente.');
      }
    } else {
      // Manejo de errores no relacionados con HTTP
      console.error('Error desconocido:', error);
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
      const response = await lastValueFrom(
        this.http.get<any>(`${environment.apiUrl}/user/obtener`, { params }).pipe(
          timeout(10000),
          retry(3),
          catchError(this.handleError)
        )
      );
      return response.data; 
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async obtenerVehiculo(data: dataGetVehiculo) {
    try {
      const params = {
        p_id: data.p_id,
        token: data.token
      };
      const response = await lastValueFrom(
        this.http.get<any>(environment.apiUrl + 'vehiculo/agregar', {params}));
      return response;
    } catch (error) {
      throw error;
    }
  }  

  async agregarViaje(data: bodyViaje) {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl + 'viaje/agregar', data)
    );
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async obtenerViaje(data: dataGetViaje) {
    try {
      const params = {
        p_id_usuario: data.p_id_usuario,
        token: data.token
      };
      const response = await lastValueFrom(
        this.http.get<any>(environment.apiUrl + 'viaje/obtener', { params })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async actualizarViaje(data: bodyActViaje) {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl + 'viaje/actualizar_estado_viaje', data)
      );
      return response;
    } catch (error) {
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
