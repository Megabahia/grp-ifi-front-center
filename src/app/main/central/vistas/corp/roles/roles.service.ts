import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private _httpClient: HttpClient) {
    
  }
  obtenerListaRoles(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/roles/list/`, datos);
  }
  crearRol(datos){
    return this._httpClient.post<any>(`${environment.apiUrl}/central/roles/create/`, {rol:datos});
  }
  actualizarRol(datos){
    if(datos.tipoUsuario || datos.tipoUsuario==""){
      delete datos.tipoUsuario;
    }
    return this._httpClient.post<any>(`${environment.apiUrl}/central/roles/update/${datos._id}`, {rol:datos});
  }
  obtenerRol(id){
    return this._httpClient.get<any>(`${environment.apiUrl}/central/roles/listOne/${id}`);
  }
  eliminarRol(id){
    return this._httpClient.delete<any>(`${environment.apiUrl}/central/roles/delete/${id}`);
  }
}
