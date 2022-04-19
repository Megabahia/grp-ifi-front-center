import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CorreosLandingService {

    constructor(private _httpClient: HttpClient) {
    }

    obtenerListaCorreos(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/central/correosLanding/list/`, datos);
    }

}
