import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SolicitudesCreditosService} from '../solicitudes-creditos.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  @Input() credito;
  @Output() pantalla = new EventEmitter<number>();
  public solicitudCredito;

  constructor(
    private _solicitudCreditosService: SolicitudesCreditosService,
  ) { }

  ngOnInit(): void {
    this._solicitudCreditosService.obtenersolicitudCredito(this.credito._id).subscribe((info) => {
      this.solicitudCredito = info;
    });
  }

  cambiarPantalla() {
    this.pantalla.emit(0);
  }

}
