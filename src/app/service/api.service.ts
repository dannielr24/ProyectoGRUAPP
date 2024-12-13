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

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Origin' : '*'
    })
  }

  apiURL = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any>{
    return this.http.get(this.apiURL + '/post/').pipe(retry(3));
  }

  getPost(id: any): Observable<any> {
    return this.http.get(this.apiURL + '/post/' + id).pipe(retry(3));
  }

  createPost(post: any): Observable<any>{
    return this.http.post(this.apiURL + '/post', post, this.httpOptions).pipe(retry(3));
  }

  updatePost(id: any, post: any): Observable<any>{
    return this.http.put(this.apiURL + '/posts/' + id, post, this.httpOptions).pipe(retry(3));
  }

  deletePost(id:any): Observable<any>{
    return this.http.delete(this.apiURL + '/posts/' + id, this.httpOptions);
  }

  async agregarUsuario(data: bodyUser, imageFile?: File | null) {
    try {
      const formData = new FormData();
      formData.append('p_nombre', data.p_nombre);
      formData.append('p_correo_electronico', data.p_correo_electronico);
      formData.append('p_telefono',data.p_telefono);
      if(data.token){
        formData.append('token', data.token);
      }
      if(imageFile){
        formData.append('image_usuario', imageFile,imageFile.name);
      }
      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl +'user/agregar',formData)
      );
      return response;
    } catch(error){
      throw error;
    }
  }

  async obtenerUsuario(data: dataGetUser) {
    try {
      const params = {
        p_correo: data.p_correo,
        token: data.token
      };
      console.log('Parámetros enviados a obtenerUsuario:', params);
      const response = await lastValueFrom(
        this.http.get<any>(environment.apiUrl + 'user/obtener', { params })
      );
      console.log('Respuesta completa de obtenerUsuario:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('Error en obtenerUsuario:', error);
      throw error;
    }
  }

async agregarVehiculo(vehiculoData: bodyVehiculo, imageFile: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('p_id_usuario', vehiculoData.p_id_usuario.toString());
    formData.append('p_patente', vehiculoData.p_patente);
    formData.append('p_marca', vehiculoData.p_marca);
    formData.append('p_modelo', vehiculoData.p_modelo);
    formData.append('p_anio', vehiculoData.p_anio.toString());
    formData.append('p_color', vehiculoData.p_color);
    formData.append('p_tipo_combustible', vehiculoData.p_tipo_combustible);
    formData.append('token', vehiculoData.token);
    formData.append('image', imageFile);

    // Iterar sobre FormData y convertirlo a un objeto
    const formDataObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    console.log('Datos enviados al servidor:', formDataObject);

    const response = await lastValueFrom(
      this.http.post<any>(`${environment.apiUrl}vehiculo/agregar`, formData)
    );
    return response;
  } catch (error) {
    console.error('Error en agregarVehiculo:', error);
    throw error;
  }
}

async obtenerVehiculo(data: { p_id: number; token: string }) {
  try {
    const params = new HttpParams()
      .set('p_id', data.p_id.toString())
      .set('token', data.token);
    
    console.log('Parámetros enviados a obtenerVehiculo:', params.toString());
    
    const response = await lastValueFrom(
      this.http.get<any>(`${environment.apiUrl}vehiculo/obtener`, { params })
    );
    console.log('Respuesta de obtenerVehiculo:', response);
    return response;
  } catch (error) {
    console.error("Error en obtenerVehiculo:", error);
    throw error;
  }
}

async agregarViaje(data: bodyViaje) {
  try {
    console.log('Datos enviados a la API:', data);
    const response = await lastValueFrom(
      this.http.post<any>(`${environment.apiUrl}viaje/agregar`, data)
    );
    console.log('Respuesta de la API:', response);
    return response;
  } catch (error) {
    console.error('Error en agregarViaje:', error);
    if (error instanceof HttpErrorResponse) {
      console.error('Detalles del error HTTP:', error.error);
      throw error.error;
    }
    throw error;
  }
}

async obtenerViaje(data: { p_id_usuario: number; token: string }) {
  try {
    const params = new HttpParams()
      .set('p_id_usuario', data.p_id_usuario.toString())
      .set('token', data.token);
    
    console.log('Parámetros enviados a obtenerViaje:', params.toString());
    
    const response = await lastValueFrom(
      this.http.get<any>(`${environment.apiUrl}viaje/obtener`, { params })
    );
    console.log('Respuesta de obtenerViaje:', JSON.stringify(response, null, 2));
    if (!response || (!Array.isArray(response) && typeof response !== 'object')) {
      console.error('Respuesta inesperada de la API:', response);
      throw new Error('La respuesta de la API no es válida');
    }
    return response;
  } catch (error) {
    console.error('Error en obtenerViaje:', error);
    throw error;
  }
}

async actualizarViaje(data: bodyActViaje) {
  try {
    const response = await lastValueFrom(
      this.http.post<any>(`${environment.apiUrl}viaje/actualizar_estado_viaje`, data)
    );
    return response;
  } catch (error) {
    throw error;
  }
}

private handleError(error: HttpErrorResponse | Error) {
  let errorMessage = 'Ocurrió un error desconocido';
  if (error instanceof HttpErrorResponse) {
    // Error del lado del servidor
    switch (error.status) {
      case 400:
        errorMessage = `Error (${error.status}): Solicitud incorrecta. ${error.error.message || 'Sin mensaje de error'}`;
        break;
      case 404:
        errorMessage = `Error (${error.status}): Recurso no encontrado. ${error.error.message || 'Sin mensaje de error'}`;
        break;
      case 500:
        errorMessage = `Error (${error.status}): Error en el servidor. ${error.error.message || 'Sin mensaje de error'}`;
        break;
      default:
        errorMessage = `Error (${error.status}): ${error.error.message || 'Sin mensaje de error'}`;
        break;
    }
  } else {
    // Error del lado del cliente
    errorMessage = `Error: ${error.message}`;
  }
  console.error(errorMessage);
  return throwError(() => new Error(errorMessage));
}
}
