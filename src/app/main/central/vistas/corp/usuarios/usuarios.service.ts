import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private _httpClient: HttpClient) { }
  obtenerListaEmpresas(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/filtro`, datos);
  }
  obtenerListaUsuarios(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/usuarios/list/corp/`, datos);
  }
  obtenerUsuario(id){
    return this._httpClient.get<any>(`${environment.apiUrl}/central/usuarios/listOne/${id}`, );

  }
  crearUsuario(datos){
    return this._httpClient.post<any>(`${environment.apiUrl}/central/usuarios/create/`, datos);
  }
  actualizarUsuario(datos){
    if(datos.infoUsuario){
      delete datos.infoUsuario;
    }
    console.log(datos);
    return this._httpClient.post<any>(`${environment.apiUrl}/central/usuarios/update/${datos._id}`, datos);
  }
  eliminarUsuario(id){
    return this._httpClient.delete<any>(`${environment.apiUrl}/central/usuarios/delete/${id}`);
  }
  obtenerEmpresa(id){
    return this._httpClient.get<any>(`${environment.apiUrl}/corp/empresas/listOne/${id}`);
  }
}
