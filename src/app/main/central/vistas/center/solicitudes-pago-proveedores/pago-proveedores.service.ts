import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {environment} from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoProveedoresService {

  constructor(private _httpClient: HttpClient) {
  }

  public obtenerSolicitudesPagoProveedores(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/pagoProveedores/list/`, datos);
  }
  public actualizarSolicitudesPagoProveedores(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/pagoProveedores/update/${datos._id}`, datos);
  }
}
