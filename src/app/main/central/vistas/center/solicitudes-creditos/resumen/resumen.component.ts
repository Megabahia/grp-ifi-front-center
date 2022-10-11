import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  @Input() credito;
  @Output() pantalla = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  cambiarPantalla() {
    this.pantalla.emit(0);
  }

}
