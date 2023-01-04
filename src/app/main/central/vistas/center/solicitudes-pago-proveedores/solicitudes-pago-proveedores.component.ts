import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';
import {Subject} from 'rxjs';
import {PagoProveedoresService} from './pago-proveedores.service';

@Component({
  selector: 'app-solicitudes-pago-proveedores',
  templateUrl: './solicitudes-pago-proveedores.component.html',
  styleUrls: ['./solicitudes-pago-proveedores.component.scss'],
  providers: [DatePipe]
})
export class SolicitudesPagoProveedoresComponent implements OnInit, AfterViewInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;

  // public
  public page = 1;
  public page_size: any = 4;
  public maxSize;
  public collectionSize;

  public listaCreditos;
  private _unsubscribeAll: Subject<any>;
  public usuario;

  constructor(
    private _pagoProveedoresService: PagoProveedoresService,
    private datePipe: DatePipe,
    private _coreMenuService: CoreMenuService,
  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpSanjoseCenterUser;
  }

  ngOnInit(): void {
    this.obtenerSolicitudesCreditos();
  }

  ngAfterViewInit() {
    this.iniciarPaginador();
  }

  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerSolicitudesCreditos();
    });
  }

  obtenerSolicitudesCreditos() {
    this._pagoProveedoresService.obtenerSolicitudesPagoProveedores({page_size: this.page_size, page: this.page - 1})
      .subscribe((info) => {
        this.collectionSize = info.cont;
        this.listaCreditos = info.info;
      });
  }

  transformarFecha(fecha) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }
}
