import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * IFIS
 * Center
 * Esta pantalla sirve para mostrar los requisitos de los creditos
 * Rutas:
 * No recibe ningun llamado de rutas
 */

@Component({
  selector: 'app-revision-documentos',
  templateUrl: './revision-documentos.component.html',
  styleUrls: ['./revision-documentos.component.scss']
})
export class RevisionDocumentosComponent implements OnInit {

  @Input() checks: string;
  @Output() pantalla = new EventEmitter<number>();

  public completado;

  constructor() {
    this.completado = false;
  }

  ngOnInit(): void {
  }

  completar() {
    this.pantalla.emit(2);
  }

}
