import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CargarCreditosNegociosService {

    constructor(private _httpClient: HttpClient) {
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
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/upload/creditos/preaprobados/negocios/${id}`, {});
    }

    verDatosArchivosPreAprobados(id: number) {
        return this._httpClient.get<any>(`${environment.apiUrl}/corp/creditoArchivos/view/creditos/preaprobados/negocios/${id}`);
    }
}
