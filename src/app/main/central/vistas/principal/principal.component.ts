import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/auth/models';
import {Subject} from 'rxjs';
import {CobroMonedas} from '../../models/superMonedas';
import {PrincipalService} from './principal.service';

/**
 * IFIS
 * center
 * Esta pantalla sirve para mostrar informacion
 * Rutas:
 * `${environment.apiUrl}/core/monedas/usuario/${id}`
 * `${environment.apiUrl}/central/productos/list/`,
 * `${environment.apiUrl}/central/productos/listOne/${id}`,
 * `${environment.apiUrl}/central/param/list/listOne`,
 */

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class PrincipalComponent implements OnInit, OnDestroy {
  @ViewChild('DetalleProducto') DetalleProducto;
  @ViewChild('CanjearProducto') CanjearProducto;
  @ViewChild('confirmarPreautorizacionMdl') confirmarPreautorizacionMdl;
  @ViewChild('mensajeModal') mensajeModal;
  @ViewChild(NgbPagination) paginator: NgbPagination;


  // public
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public cobroMonedas: CobroMonedas;
  public listaCobros;
  public idCobro = '';
  public mensaje = '';
  public wishlist;
  public productos;
  public producto;
  private _unsubscribeAll: Subject<any>;
  public usuario: User;

  constructor(
    private _principalService: PrincipalService,
    private _coreMenuService: CoreMenuService,
    private modalService: NgbModal,
  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpSanjoseCenterUser;
    this.cobroMonedas = {
      codigoCobro: '',
      correo: '',
      identificacion: '',
      monto: ''
    };
  }

  ngOnInit(): void {

    this.obtenerListaCobros();
  }

  obtenerListaCobros() {
    this._principalService.obtenerListaCobros({
      ...this.cobroMonedas, page_size: this.page_size, page: this.page - 1
    }).subscribe(info => {

      this.collectionSize = info.cont;
      this.listaCobros = info.info;
    });
  }

  abrirModal(modal) {
    this.modalService.open(modal);
  }

  cerrarModal() {
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
