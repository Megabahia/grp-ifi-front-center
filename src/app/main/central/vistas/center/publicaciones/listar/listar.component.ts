import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {ParametrizacionesService} from '../../parametrizaciones/parametrizaciones.service';
import {Publicacion} from '../models/publicacion';
import {PublicacionesService} from '../publicaciones.service';

/**
 * IFIS
 * Center
 * ESta pantalla sirve para listar las publicaciones
 * Rutas:
 * `${environment.apiUrl}/corp/empresas/listOne/filtros/`,
 * `${environment.apiUrl}/central/publicaciones/update/${id}`,
 * `${environment.apiUrl}/central/publicaciones/create/`,
 * `${environment.apiUrl}/central/publicaciones/listFull/`,
 * `${environment.apiUrl}/central/publicaciones/listOne/${id}`
 * `${environment.apiUrl}/central/publicaciones/delete/${id}`,
 */

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('eliminarProductoMdl') eliminarProductoMdl;
  @ViewChild('mensajeModal') mensajeModal;
  public publicacionForm: FormGroup;
  public publicacionessSubmitted: boolean = false;
  public page = 1;
  public pageSize: any = 10;
  public maxSize;
  public collectionSize;
  public idPublicacion;
  public loading = false;
  public empresa_id;
  public imagen;
  public publicacionessFormData = new FormData();
  public publicacion: Publicacion;
  public nombreBuscar;
  public publicaciones;
  public tipoPadre = '';
  public fecha = '';
  public padres;
  public mensaje = '';
  public idPadre = '';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private publicacionesService: PublicacionesService,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _coreSidebarService: CoreSidebarService,
    private paramService: ParametrizacionesService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this._unsubscribeAll = new Subject();
    this.idPublicacion = '';
    this.publicacion = this.inicializarProducto();
  }

  get prodForm() {
    return this.publicacionForm.controls;
  }

  inicializarProducto(): Publicacion {
    return {
      _id: '',
      titulo: '',
      subtitulo: '',
      descripcion: '',
      imagen: '',
      url: '',
    };
  }

  obtenerEmpresaId() {
    this.paramService.obtenerEmpresa({
      nombreComercial: 'Global Red Pyme'
    }).subscribe((info) => {
      this.empresa_id = info._id;
    }, (error) => {
      this.mensaje = 'Ha ocurrido un error al actualizar su imagen';
      this.abrirModal(this.mensajeModal);
    });
  }

  ngOnInit(): void {
    this.publicacionForm = this._formBuilder.group({
      titulo: ['', [Validators.required]],
      subtitulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      // imagen: ["", [Validators.required]],
      url: ['', [Validators.required]],
    });
    this.obtenerEmpresaId();
    this.changeDetector.detectChanges();

  }

  ngAfterViewInit() {
    this.iniciarPaginador();

    this.obtenerListaPublicaciones();
  }

  guardarPublicacion() {
    this.publicacionessSubmitted = true;
    if (this.publicacionForm.invalid) {
      return;
    }
    let productoValores = Object.values(this.publicacion);
    let productoLlaves = Object.keys(this.publicacion);
    productoLlaves.map((llaves, index) => {
      if (llaves != 'imagen') {
        if (productoValores[index]) {
          this.publicacionessFormData.delete(llaves);
          this.publicacionessFormData.append(llaves, productoValores[index]);
        }
      }
      this.publicacionessFormData.delete('empresa_id');
      this.publicacionessFormData.append('empresa_id', this.empresa_id);
    });

    this.loading = true;
    if (this.publicacion._id) {
      // let productoAct: any;
      // if (!this.publicacionessFormData.get('imagen')) {
      //   productoAct = this.publicacion;
      //   delete productoAct.imagen;
      // } else {
      //   productoAct = this.publicacionessFormData;
      // }
      this.publicacionesService.actualizarPublicacion(this.publicacionessFormData, this.publicacion._id).subscribe(() => {
          this.obtenerListaPublicaciones();
          this.mensaje = 'Producto actualizado con éxito';
          this.abrirModal(this.mensajeModal);
          this.loading = false;
        },
        (error) => {
          this.mensaje = 'Ha ocurrido un error';
          this.abrirModal(this.mensajeModal);
          this.loading = false;
        });
    } else {

      this.publicacionesService.crearPublicacion(this.publicacionessFormData).subscribe((info) => {
          this.obtenerListaPublicaciones();
          this.mensaje = 'Producto guardado con éxito';
          this.abrirModal(this.mensajeModal);
          this.loading = false;
        },
        (error) => {
          this.mensaje = 'Ha ocurrido un error';
          this.abrirModal(this.mensajeModal);
          this.loading = false;
        });
    }


  }

  async subirImagen(event) {

    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      this.imagen = imagen.name;
      this.publicacionessFormData.delete('imagen');
      this.publicacionessFormData.append('imagen', imagen, Date.now() + '_' + imagen.name);
    }
  }

  obtenerListaPublicaciones() {
    this.publicacionesService.obtenerListaPublicaciones(
      {
        page: this.page - 1,
        page_size: this.pageSize,
        // nombre: this.nombreBuscar
      }
    ).subscribe((info) => {
      this.publicaciones = info.info;
      this.collectionSize = info.cont;
    });
  }

  toggleSidebar(name, id): void {
    this.imagen = '';
    if (id) {
      this.publicacionesService.obtenerPublicacion(id).subscribe((info) => {
        this.publicacion = info;
        this.fecha = info.vigencia;
        this.imagen = this.visualizarNombreArchivo(info.imagen);
      }, (error) => {

      });
    } else {
      this.publicacionessFormData = new FormData();
      this.publicacion = this.inicializarProducto();
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  iniciarPaginador() {

    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaPublicaciones();
    });
  }

  visualizarNombreArchivo(nombre) {
    let stringArchivos = 'https://globalredpymes.s3.amazonaws.com/CENTRAL/imgProductos/';
    return nombre.replace(stringArchivos, '');
  }

  eliminarProductoModal(id) {
    this.idPublicacion = id;
    this.abrirModal(this.eliminarProductoMdl);
  }

  eliminarPublicacion() {
    this.publicacionesService.eliminarPublicacion(this.idPublicacion).subscribe((info) => {
        this.obtenerListaPublicaciones();
        this.mensaje = 'Producto eliminado con éxito';
        this.abrirModal(this.mensajeModal);
      },
      (error) => {
        this.mensaje = 'Error al eliminar publicacion';
        this.abrirModal(this.mensajeModal);
      });
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
