import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbPagination, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {EmpresasService} from '../empresas.service';
import {Empresa} from '../models/empresas';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ParametrizacionesService} from '../../../center/parametrizaciones/parametrizaciones.service';

/**
 * Bigpuntos
 * CEnter
 * Esta pantalla sirve para listar las empresas
 * Rutas:
 * `${environment.apiUrl}/corp/empresas/listOne/${id}`
 * `${environment.apiUrl}/corp/empresas/create/`,
 * `${environment.apiUrl}/corp/empresas/update/${id}`,
 * `${environment.apiUrl}/central/param/list/tipo/todos/`,
 * `${environment.apiUrl}/central/param/list/filtro/nombre`,
 * `${environment.apiUrl}/corp/empresas/delete/${id}`
 * `${environment.apiUrl}/corp/empresas/list/`,
 */

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [DatePipe]

})
export class ListarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('mensajeModal') mensajeModal;
  @ViewChild('eliminarEmpresaMdl') eliminarEmpresaMdl;
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public empresas;
  public empresa: Empresa;
  public imagen;
  private _unsubscribeAll: Subject<any>;
  private idEmpresa;
  public empresaForm: FormGroup;
  public empresaSubmitted: boolean;
  public empresaFormData = new FormData();

  public mensaje = '';
  public cargandoEmpresa = false;
  public tipoEmpresaOpciones;
  public categoriaEmpresaOpciones;
  public paisOpciones;
  public provinciaOpciones;
  public ciudadOpciones;

  constructor
  (
    private paramService: ParametrizacionesService,
    private datePipe: DatePipe,
    private _coreSidebarService: CoreSidebarService,
    private _empresasService: EmpresasService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {
    this._unsubscribeAll = new Subject();
    this.idEmpresa = '';
    this.empresa = this.inicializarEmpresa();
  }

  inicializarEmpresa() {
    return {
      id: '',
      direccion: '',
      ciudad: '',
      correo: '',
      estado: '',
      nombreComercial: '',
      nombreEmpresa: '',
      pais: '',
      provincia: '',
      ruc: '',
      telefono1: '',
      telefono2: '',
      tipoCategoria: '',
      tipoEmpresa: ''
    };
  }

  async subirImagen(event) {

    if (event.target.files && event.target.files[0]) {
      const imagen = event.target.files[0];
      this.imagen = imagen.name;
      this.empresaFormData.delete('imagen');
      this.empresaFormData.append('imagen', imagen, Date.now() + '_' + imagen.name);
    }
  }

  ngOnInit(): void {
    this.empresaForm = this._formBuilder.group({
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      nombreComercial: ['', [Validators.required]],
      nombreEmpresa: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      ruc: ['', [Validators.required]],
      telefono1: ['', [Validators.required]],
      telefono2: ['', [Validators.required]],
      tipoCategoria: ['', [Validators.required]],
      tipoEmpresa: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaEmpresas();
    this.obtenerTipoEmpresaOpciones();
    this.obtenerCategoriaEmpresaOpciones();
    this.obtenerPaisOpciones();
    this.obtenerProvinciaOpciones();
    this.obtenerCiudadOpciones();
  }

  toggleSidebar(name, id): void {
    this.idEmpresa = id;
    if (this.idEmpresa) {
      this._empresasService.obtenerEmpresa(this.idEmpresa).subscribe((info) => {
          this.empresa = info;
          this.imagen = this.visualizarNombreArchivo(info.imagen);
          this.obtenerPaisOpciones();
          this.obtenerProvinciaOpciones();
          this.obtenerCiudadOpciones();
        },
        (error) => {
          this.mensaje = 'No se ha podido obtener la empresa';

          this.abrirModal(this.mensajeModal);
        });
    } else {
      this.empresa = this.inicializarEmpresa();
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  visualizarNombreArchivo(nombre) {
    const stringArchivos = 'https://globalredpymes.s3.amazonaws.com/CORP/imgEmpresas/';
    return nombre.replace(stringArchivos, '');
  }

  get empForm() {
    return this.empresaForm.controls;
  }

  guardarEmpresa() {
    this.empresaSubmitted = true;
    if (this.empresaForm.invalid) {
      return;
    }
    this.cargandoEmpresa = true;
    const productoValores = Object.values(this.empresa);
    const productoLlaves = Object.keys(this.empresa);
    productoLlaves.map((llaves, index) => {
      if (llaves !== 'imagen') {
        if (productoValores[index]) {
          this.empresaFormData.delete(llaves);
          this.empresaFormData.append(llaves, productoValores[index]);
        }
      }
    });
    if (this.idEmpresa === '') {
      this._empresasService.crearEmpresa(this.empresaFormData).subscribe((info) => {
          this.obtenerListaEmpresas();
          this.mensaje = 'Empresa guardada con éxito';
          this.abrirModal(this.mensajeModal);
          this.toggleSidebar('guardarEmpresa', '');
          this.cargandoEmpresa = false;

        },
        (error) => {
          this.mensaje = 'Error al crear empresa';

          this.abrirModal(this.mensajeModal);
          this.cargandoEmpresa = false;

        });
    } else {
      this._empresasService.actualizarEmpresa(this.empresaFormData, this.idEmpresa).subscribe((info) => {
          this.obtenerListaEmpresas();
          this.mensaje = 'Empresa actualizada con éxito';
          this.abrirModal(this.mensajeModal);
          this.toggleSidebar('guardarEmpresa', '');
          this.cargandoEmpresa = false;

        },
        (error) => {
          this.mensaje = 'Error al actualizar empresa';
          this.abrirModal(this.mensajeModal);
          this.cargandoEmpresa = false;

        });
    }

  }

  obtenerTipoEmpresaOpciones() {
    this.paramService.obtenerListaPadres('TIPO_EMPRESA').subscribe((info) => {
      this.tipoEmpresaOpciones = info;
    });
  }

  obtenerCategoriaEmpresaOpciones() {
    this.paramService.obtenerListaPadres('CATEGORIA_EMPRESA').subscribe((info) => {
      this.categoriaEmpresaOpciones = info;
    });
  }

  obtenerPaisOpciones() {
    this.paramService.obtenerListaPadres('PAIS').subscribe((info) => {
      this.paisOpciones = info;
    });
  }

  obtenerProvinciaOpciones() {
    this.paramService.obtenerListaHijos(this.empresa.pais, 'PAIS').subscribe((info) => {
      this.provinciaOpciones = info;
    });
  }

  obtenerCiudadOpciones() {
    this.paramService.obtenerListaHijos(this.empresa.provincia, 'PROVINCIA').subscribe((info) => {
      this.ciudadOpciones = info;
    });
  }

  eliminarEmpresa() {
    this._empresasService.eliminarEmpresa(this.idEmpresa).subscribe(() => {
        this.obtenerListaEmpresas();
        this.mensaje = 'Empresa eliminada correctamente';
        this.abrirModal(this.mensajeModal);
      },
      (error) => {
        this.mensaje = 'Ha ocurrido un error al eliminar la empresa';
        this.abrirModal(this.mensajeModal);
      });
  }

  obtenerListaEmpresas() {
    this._empresasService.obtenerListaEmpresas({
      page: this.page - 1, page_size: this.page_size
    }).subscribe(info => {
      this.empresas = info.info;
      this.collectionSize = info.cont;
    });
  }

  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaEmpresas();
    });
  }

  eliminarEmpresaModal(id) {
    this.idEmpresa = id;
    this.abrirModal(this.eliminarEmpresaMdl);
  }

  abrirModal(modal) {
    this._modalService.open(modal);
  }

  cerrarModal() {
    this._modalService.dismissAll();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
