import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class SolicitudesCreditosService {

    constructor(private _httpClient: HttpClient, private firestore: AngularFirestore) {
    }
    public obtenerSolicitudesCreditos(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/list/`, datos);
    }

    public obtenersolicitudCredito(id) {
        return this._httpClient.get<any>(`${environment.apiUrl}/corp/creditoPersonas/listOne/${id}`);
    }

    public actualizarSolictudesCreditos(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/update/${datos.get('id')}`, datos);
    }

    actualizarSolictudesCreditosObservacion(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/update/${datos._id}`, datos);
    }
    actualizarChecksCreditos(datos) {
        const {id, ...resto} = datos;
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/update/${id}`, {'checks': JSON.stringify(resto), 'estado': 'Verificado'});
    }
    getCreditosFirebase() {
        return this.firestore.collection('creditosPersonas').snapshotChanges();
    }
    deleteDocumentFirebase(data) {
        return this.firestore.collection('creditosPersonas').doc(data).delete();
    }
    actualizarAWS() {
        return this._httpClient.get<any>(`${environment.apiUrl}/corp/creditoPersonas/pruebaConsumer`);
    }
}
