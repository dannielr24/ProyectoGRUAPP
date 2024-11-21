import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpHeaders, 
  HttpErrorResponse,
} from '@angular/common/http';
import { retry, catchError } from 'rxjs';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Asegúrate de que la ruta sea correcta
import { UserModel } from '../models/user.model';
import { idTokenResult } from '@angular/fire/compat/auth-guard';
import { IMAGE_CONFIG } from '@angular/common';

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
        this.http.post<any>(environment.apiUrl + 'user/agregar', formData)
      );
      return response;
    } catch (error) {
      throw error;
    }
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

