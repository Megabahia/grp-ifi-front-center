import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EmpresasService} from '../../empresas/empresas.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {ParametrizacionesService} from '../../../center/parametrizaciones/parametrizaciones.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-empleados-empresas',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {
  @Input() empresaId: string;
  @Output() pantalla = new EventEmitter<any>();
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('mensajeModal') mensajeModal;
  @ViewChild('eliminarEmpresaMdl') eliminarEmpresaMdl;
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public empleados;
  public empleadoForm: FormGroup;
  public tipoIdentificacionesOpciones;
  public submitted = false;
  public empresa = '';
  public cargandoEmpresa = false;
  private idEmpleado = 0;
  private mensaje = '';

  constructor(
    private _empresasService: EmpresasService,
    private paramService: ParametrizacionesService,
    private _coreSidebarService: CoreSidebarService,
    private route: ActivatedRoute,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
  ) {
    // this.route.params.subscribe((params) => {
    //     this.empresa = params.empresa;
    //     console.log(params);
    //   }
    // );
    this.empresa = this.empresaId;
  }

  get emplForm() {
    return this.empleadoForm.controls;
  }

  ngOnInit(): void {
    this.empresa = this.empresaId;
    this.obtenerListaEmpleados();
    this.obtenerTipoIdentificacionesOpciones();
    this.empleadoForm = this._formBuilder.group({
      tipoIdentificacion: ['', [Validators.required]],
      identificacion: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      whatsapp: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      estado: ['', [Validators.required]],
    });
  }

  obtenerListaEmpleados() {
    console.log('entro al metodo');
    this._empresasService.obtenerListaEmpleados({
      page: this.page - 1, page_size: this.page_size,
      empresa: this.empresa
    }).subscribe(info => {
      this.empleados = info.info;
      this.collectionSize = info.cont;
    });
  }

  obtenerTipoIdentificacionesOpciones() {
    this.paramService.obtenerListaPadres('TIPO_IDENTIFICACION').subscribe((info) => {
      this.tipoIdentificacionesOpciones = info;
    });
  }

  toggleSidebar(name, id): void {
    this.idEmpleado = id;
    if (this.idEmpleado) {
      this._empresasService.obtenerEmpleado(this.idEmpleado).subscribe((info) => {
          this.empleadoForm.patchValue({...info});
        },
        (error) => {
          // this.mensaje = 'No se ha podido obtener la empresa';
          //
          // this.abrirModal(this.mensajeModal);
        });
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  guardarEmpleado() {
    this.submitted = true;
    if (this.empleadoForm.invalid) {
      console.log('error form', this.empleadoForm);
      return;
    }
    this.cargandoEmpresa = true;
    this._empresasService.actualizarEmpleado(this.empleadoForm.value, this.idEmpleado).subscribe((info) => {
        this.obtenerListaEmpleados();
        // this.mensaje = 'Empresa actualizada con éxito';
        // this.abrirModal(this.mensajeModal);
        this.toggleSidebar('guardarEmpresa', '');
        this.cargandoEmpresa = false;
      },
      (error) => {
        const errores = Object.values(error);
        const llaves = Object.keys(error);
        // this.mensaje = 'Error al actualizar empresa';
        // this.abrirModal(this.mensajeModal);
        this.cargandoEmpresa = false;
      });

  }

  eliminarEmpleado() {
    this._empresasService.eliminarEmleado(this.idEmpleado).subscribe(() => {
        this.obtenerListaEmpleados();
        this.mensaje = 'Empresa eliminada correctamente';
        this.abrirModal(this.mensajeModal);
      },
      (error) => {
        this.mensaje = 'Ha ocurrido un error al eliminar la empresa';
        this.abrirModal(this.mensajeModal);
      });
  }

  eliminarEmpresaModal(id) {
    this.idEmpleado = id;
    this.abrirModal(this.eliminarEmpresaMdl);
  }

  abrirModal(modal) {
    this._modalService.open(modal);
  }

  cerrarModal() {
    this._modalService.dismissAll();
  }

  volver() {
    this.pantalla.emit(1);
  }
}
