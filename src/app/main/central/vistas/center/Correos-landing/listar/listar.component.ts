import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {CorreosLandingService} from '../correos-landing.service';
import {ExportService} from '../../../../../../services/export/export.service';

@Component({
    selector: 'app-listar',
    templateUrl: './listar.component.html',
    styleUrls: ['./listar.component.scss'],
    providers: [DatePipe]
})
export class ListarComponent implements OnInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    @ViewChild('mensajeModal') mensajeModal;
    // Paginacion
    public page = 1;
    public pageSize: any = 10;
    public maxSize;
    public collectionSize;
    // Exportacion
    public infoExportar;
    // Variables
    public loading = false;
    public correos;
    public mensaje = '';
    private _unsubscribeAll: Subject<any>;

    constructor(
        private correosService: CorreosLandingService,
        private _modalService: NgbModal,
        private datePipe: DatePipe,
        private changeDetector: ChangeDetectorRef,
        private exportFile: ExportService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.changeDetector.detectChanges();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.iniciarPaginador();
        this.obtenerListaProductos();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaProductos();
        });
    }

    abrirModal(modal) {
        this._modalService.open(modal);
    }

    cerrarModal() {
        this._modalService.dismissAll();
    }

    transformarFecha(fecha) {
        return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }

    obtenerListaProductos() {
        this.correosService.obtenerListaCorreos(
            {
                page: this.page - 1,
                page_size: this.pageSize,
            }
        ).subscribe((info) => {
            this.correos = info.info;
            this.collectionSize = info.cont;
        });
    }

    comprobarEstado(estado: boolean) {
        return estado ? 'Si' : 'No' ;
    }

    exportarExcel() {
        this.infoExportar = [];
        const headers = ['Fecha de Registro', 'Cuenta de Correo', 'Es Correo Validado', 'Se validó Código', 'Accedió a Productos'];
        this.correos.forEach((row: any) => {

            const values = [];
            values.push(row['fechaRegistro']);
            values.push(row['correo']);
            values.push(this.comprobarEstado(row['correoValido']));
            values.push(this.comprobarEstado(row['codigoValido']));
            values.push(this.comprobarEstado(row['accedio']));
            this.infoExportar.push(values);
        });
        const reportData = {
            title: 'Reporte de Correos de Landing Page SM',
            data: this.infoExportar,
            headers
        };
        this.exportFile.exportExcel(reportData);
    }

}
