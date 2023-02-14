import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(private _httpClient: HttpClient) {
  }

  obtenerListaEmpresas(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/`, datos);
  }

  crearEmpresa(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/create/`, datos);
  }

  actualizarEmpresa(datos, id) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/update/${id}`, datos);
  }

  obtenerEmpresa(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/corp/empresas/listOne/${id}`);
  }

  eliminarEmpresa(id) {
    return this._httpClient.delete<any>(`${environment.apiUrl}/corp/empresas/delete/${id}`);
  }

  subirEmpleados(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/upload/empleados/`, datos);
  }

  obtenerListaEmpleados(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/empleados/`, datos);
  }

  obtenerEmpleado(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/corp/empresas/listOne/empleado/${id}`);
  }

  actualizarEmpleado(datos, id) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/actualizar/${id}`, datos);
  }

  eliminarEmleado(id) {
    return this._httpClient.delete<any>(`${environment.apiUrl}/corp/empresas/empleado/delete/${id}`);
  }
}
