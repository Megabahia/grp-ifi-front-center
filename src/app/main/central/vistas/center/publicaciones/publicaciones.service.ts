import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  constructor(private _httpClient: HttpClient) { }
  obtenerListaPublicaciones(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/publicaciones/listFull/`, datos);
  }
  crearPublicacion(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/publicaciones/create/`, datos);
  }
  obtenerPublicacion(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/central/publicaciones/listOne/${id}`,);
  }
  actualizarPublicacion(datos, id) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/publicaciones/update/${id}`, datos);
  }
  eliminarPublicacion(id) {
    return this._httpClient.delete<any>(`${environment.apiUrl}/central/publicaciones/delete/${id}`,);
  }
}
