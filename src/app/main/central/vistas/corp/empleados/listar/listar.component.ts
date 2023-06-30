import {Component, OnInit, ViewChild} from '@angular/core';
import {EmpresasService} from '../../empresas/empresas.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-listar',
    templateUrl: './listar.component.html',
    styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    @ViewChild('mensajeModal') mensajeModal;
    @ViewChild('eliminarEmpresaMdl') eliminarEmpresaMdl;
    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public submitted = false;
    public cargandoEmpresa = false;
    public empresas;
    private idEmpresa;
    public empleadosForm: FormGroup;
    private empleadosFormData: FormData;
    public mensaje = '';
    public pantalla = 1;
    public empresaId = '';

    constructor(
        private _empresasService: EmpresasService,
        private _coreSidebarService: CoreSidebarService,
        private _formBuilder: FormBuilder,
        private _modalService: NgbModal,
    ) {
        this.empleadosFormData = new FormData();
    }

    get empForm() {
        return this.empleadosForm.controls;
    }

    ngOnInit(): void {
        this.obtenerListaEmpresas();
        this.empleadosForm = this._formBuilder.group({
            empresa: ['', [Validators.required]],
            archivo: ['', [Validators.required]],
        });
    }

    subirArchivo(event) {

        if (event.target.files && event.target.files[0]) {
            const imagen = event.target.files[0];
            this.empleadosFormData.delete('documento');
            this.empleadosFormData.append('documento', imagen, Date.now() + '_' + imagen.name);
        }
    }

    obtenerListaEmpresas() {
        this._empresasService.obtenerListaEmpresas({
            page: this.page - 1, page_size: this.page_size, estado: 'Activo'
        }).subscribe(info => {
            this.empresas = info.info;
            this.collectionSize = info.cont;
        });
    }

    toggleSidebar(name, id): void {
        this.idEmpresa = id;
        if (this.idEmpresa) {
            // this._empresasService.obtenerEmpresa(this.idEmpresa).subscribe((info) => {
            //     this.empresa = info;
            //     this.imagen = this.visualizarNombreArchivo(info.imagen);
            //     this.obtenerPaisOpciones();
            //     this.obtenerProvinciaOpciones();
            //     this.obtenerCiudadOpciones();
            //   },
            //   (error) => {
            //     this.mensaje = 'No se ha podido obtener la empresa';
            //
            //     this.abrirModal(this.mensajeModal);
            //   });
        } else {
            // this.empresa = this.inicializarEmpresa();
        }
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    guardarEmpleados() {
        this.submitted = true;
        if (this.empleadosForm.invalid) {
            console.log('form', this.empleadosForm);
            return;
        }
        this.cargandoEmpresa = true;
        this.empleadosFormData.delete('empresa');
        this.empleadosFormData.append('empresa', this.empForm.empresa.value);
        this._empresasService.subirEmpleados(this.empleadosFormData).subscribe((data) => {
                this.cargandoEmpresa = false;
                console.log('respuesta', data);
                this.mensaje = 'Empleados cargados exitosamente.';
                this.abrirModal(this.mensajeModal);
            },
            (error) => {
                console.log(error);
                this.mensaje = 'Error al cargar empleados.';
                this.abrirModal(this.mensajeModal);
            });
    }

    abrirModal(modal) {
        this._modalService.open(modal);
    }

    cerrarModal() {
        this._modalService.dismissAll();
    }

    cambiarPantalla(empresaId: any) {
        this.empresaId = empresaId;
        this.pantalla = 2;
    }

    listarEmpresas($event) {
        this.pantalla = $event;
    }

}
