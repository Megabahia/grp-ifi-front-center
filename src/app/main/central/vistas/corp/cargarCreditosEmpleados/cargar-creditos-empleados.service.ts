import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargarCreditosEmpleadosService {

  constructor(private _httpClient: HttpClient) { }

  cargarCreditos(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/upload/creditos/preaprobados/empleados/`,datos);
  }
  obtenerListaEmpresasCorps(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/comercial`, datos);
  }
  obtenerListaEmpresasIfis(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/ifis`, datos);
  }
  crearArchivoPreAprobados(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/create/`, datos);
  }
  obtenerListaArchivosPreAprobados(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/list/`, datos);
  }
  eliminarArchivosPreAprobados(id) {
    return this._httpClient.delete<any>(`${environment.apiUrl}/corp/creditoArchivos/delete/${id}`);
  }
  subirArchivosPreAprobados(id) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/upload/creditos/preaprobados/empleados/${id}`, {});
  }
}
