import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {SolicitudesCreditosService} from '../solicitudes-creditos/solicitudes-creditos.service';
import {Subject} from 'rxjs';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';

@Component({
  selector: 'app-consumo-creditos',
  templateUrl: './consumo-creditos.component.html',
  styleUrls: ['./consumo-creditos.component.scss'],
  providers: [DatePipe]
})
export class ConsumoCreditosComponent implements OnInit {
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
    private _solictudesCreditosService: SolicitudesCreditosService,
    private datePipe: DatePipe,
    private _coreMenuService: CoreMenuService,
  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpCenterUser;
  }

  ngOnInit(): void {
    this.obtenerSolicitudesCreditos();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.iniciarPaginador();
  }

  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerSolicitudesCreditos();
    });
  }

  obtenerSolicitudesCreditos() {
    this._solictudesCreditosService.obtenerSolicitudesCreditos({page_size: this.page_size, page: this.page - 1})
      .subscribe((info) => {
        this.collectionSize = info.cont;
        this.listaCreditos = info.info;
      });
  }

  transformarFecha(fecha) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }
}
