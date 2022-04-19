import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductosMensajeSmService {

    constructor(private _httpClient: HttpClient) {
    }

    obtenerListaProductos(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/central/productos/list/`, datos);
    }

    crearProducto(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/central/productos/create/`, datos);
    }

    obtenerProducto(id) {
        return this._httpClient.get<any>(`${environment.apiUrl}/central/productos/listOne/${id}`);
    }

    actualizarProducto(datos, id) {
        return this._httpClient.post<any>(`${environment.apiUrl}/central/productos/update/${id}`, datos);
    }

    eliminarProducto(id) {
        return this._httpClient.delete<any>(`${environment.apiUrl}/central/productos/delete/${id}`);
    }
}
