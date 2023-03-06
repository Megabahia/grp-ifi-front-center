import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {PagoProveedoresService} from '../solicitudes-pago-proveedores/pago-proveedores.service';
import {DatePipe} from '@angular/common';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';

@Component({
    selector: 'app-solicitud-pago-empleados',
    templateUrl: './solicitud-pago-empleados.component.html',
    styleUrls: ['./solicitud-pago-empleados.component.scss'],
    providers: [DatePipe]
})
export class SolicitudPagoEmpleadosComponent implements OnInit, AfterViewInit {

    @ViewChild(NgbPagination) paginator: NgbPagination;
    @ViewChild('negarMdl') negarMdl;
    @ViewChild('procesarMdl') procesarMdl;

    // public
    public page = 1;
    public page_size: any = 4;
    public maxSize;
    public collectionSize;

    public listaCreditos;
    private _unsubscribeAll: Subject<any>;
    public usuario;
    public observacion = '';
    public idPagoProveedor = '';
    private solicitudPago;


    constructor(
        private _pagoProveedoresService: PagoProveedoresService,
        private datePipe: DatePipe,
        private _coreMenuService: CoreMenuService,
        private _modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpSanjoseCenterUser;
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
        this._pagoProveedoresService.obtenerSolicitudesPagoEmpleados({page_size: this.page_size, page: this.page - 1})
            .subscribe((info) => {
                this.collectionSize = info.cont;
                this.listaCreditos = info.info;
            });
    }

    seguroNegarModal(id) {
        this.idPagoProveedor = id;
        this.observacion = '';
        this.abrirModal(this.negarMdl);
    }

    enviarNegar() {
        this._pagoProveedoresService.actualizarSolicitudesPagoProveedores({
            _id: this.idPagoProveedor,
            estado: 'Negado',
            observacion: this.observacion
        })
            .subscribe((info) => {
                this.obtenerSolicitudesCreditos();
            });
    }

    enviarProcesar() {
        this._pagoProveedoresService.actualizarSolicitudesPagoProveedores({
            _id: this.idPagoProveedor,
            estado: 'Procesar',
            fechaFirma: this.fechaActual()
        })
            .subscribe((info) => {
                this._modalService.dismissAll();
                this.obtenerSolicitudesCreditos();
            });
    }

    getUsuario(usuario, atributo) {
        return JSON.parse(usuario.usuario)?.[atributo];
    }

    fechaActual() {
        return this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    }

    procesarPago(pago) {
        this.idPagoProveedor = pago._id;
        this.solicitudPago = pago;
        this.abrirModal(this.procesarMdl);
    }

    transformarFecha(fecha) {
        return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }

    transformarObjecto(usuario, atributo) {
        return JSON.parse(usuario)[atributo];
    }

    abrirModal(modal) {
        this._modalService.open(modal);
    }

}
