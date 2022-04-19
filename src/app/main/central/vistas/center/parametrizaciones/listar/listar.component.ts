import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ParametrizacionesService } from '../parametrizaciones.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Parametrizacion } from '../models/parametrizaciones';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { CoreSidebarService } from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [DatePipe]

})
export class ListarComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('eliminarParametroMdl') eliminarParametroMdl;
  @ViewChild('mensajeModal') mensajeModal;
  public parametrizacionForm: FormGroup;
  public paramSubmitted: boolean = false;
  public page = 1;
  public pageSize: any = 10;
  public maxSize;
  public collectionSize;
  public idParametro;
  public listaParametros;
  public tiposOpciones: string = "";
  public tipos;
  public parametrizacion: Parametrizacion;
  public nombreBuscar;
  public parametros;
  public tipoPadre = "";
  public padres;
  public mensaje = "";
  public idPadre = "";
  private _unsubscribeAll: Subject<any>;

  constructor(
    private paramService: ParametrizacionesService,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _coreSidebarService: CoreSidebarService,

  ) {
    this._unsubscribeAll = new Subject();
    this.idParametro = "";
    this.parametrizacion = this.inicializarParametrizacion();
  }
  get paramForm() {
    return this.parametrizacionForm.controls;
  }
  inicializarParametrizacion() {
    return {
      id: "",
      descripcion: "",
      idPadre: "",
      // maximo: "",
      // minimo: "",
      nombre: "",
      tipo: "",
      tipoVariable: "",
      valor: ""
    }
  }

  ngOnInit(): void {
    this.parametrizacionForm = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      tipoVariable: ['', [Validators.required]],
      valor: ['', [Validators.required]]
    });
  }
  ngAfterViewInit() {
    this.iniciarPaginador();

    this.obtenerListaParametros();
  }
  guardarParametro() {
    this.paramSubmitted = true;
    if (this.parametrizacionForm.invalid) {
      return;
    }
    if (this.idParametro == "") {
      this.paramService.crearParametro(this.parametrizacion).subscribe((info) => {
        this.mensaje = "Parámetro creado correctamente";
        this.abrirModal(this.mensajeModal);
        this.obtenerListaParametros();
        this.toggleSidebar('guardarParametrizacion', '');
      },
        (error) => {
          this.mensaje = "No se ha podido guardar el parámetro";
          this.abrirModal(this.mensajeModal);
          this.toggleSidebar('guardarParametrizacion', '');

        });
    } else {
      this.paramService.actualizarParametro(this.parametrizacion).subscribe((info) => {
        this.mensaje = "Parámetro actualizado con éxito";
        this.abrirModal(this.mensajeModal);
        this.obtenerListaParametros();
        this.toggleSidebar('guardarParametrizacion', '');
      },
        (error) => {
          this.mensaje = "No se ha podido actualizar el parámetro";
          this.abrirModal(this.mensajeModal);
          this.toggleSidebar('guardarParametrizacion', '');

        });
    }
  }
  obtenerListaParametros() {
    this.paramService.obtenerListaParametrizaciones(
      {
        page: this.page - 1,
        page_size: this.pageSize,
        // tipo: this.tiposOpciones,
        // nombre: this.nombreBuscar
      }
    ).subscribe((info) => {
      this.parametros = info.info;
      this.collectionSize = info.cont;
    });
  }
  toggleSidebar(name, id): void {
    this.idParametro = id;
    if (this.idParametro) {
      this.paramService.obtenerParametro(this.idParametro).subscribe((info) => {
        this.parametrizacion = info;

        if (info.idPadre && info.idPadre != "None") {
          this.paramService.obtenerParametro(info.idPadre).subscribe((data) => {
            this.tipoPadre = data.tipo;
            this.paramService.obtenerListaPadres(data.tipo).subscribe((infoLista) => {
              this.padres = infoLista;
            });
          });
          this.parametrizacion.idPadre = info.idPadre;
        } else {
          this.tipoPadre = "";
          this.parametrizacion.idPadre = "";
        }
      },
        (error) => {
          this.mensaje = "No se ha podido obtener el parámetro";

          this.abrirModal(this.mensajeModal);
        });
    } else {
      this.parametrizacion = this.inicializarParametrizacion();
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  iniciarPaginador() {
    this.paramService.obtenerListaTipos().subscribe((result) => {
      this.tipos = result;
    });
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaParametros();
    });
  }

  eliminarParametroModal(id) {
    this.idParametro = id;
    this.abrirModal(this.eliminarParametroMdl);
  }
  eliminarParametro() {
    this.paramService.eliminarParametro(this.idParametro).subscribe(() => {
      this.obtenerListaParametros();
      this.mensaje = "Parámetro eliminado correctamente";
      this.abrirModal(this.mensajeModal);
    },
      (error) => {
        this.mensaje = "Ha ocurrido un error al eliminar el rol";
        this.abrirModal(this.mensajeModal);
      });
  }
  abrirModal(modal) {
    this._modalService.open(modal)
  }
  cerrarModal() {
    this._modalService.dismissAll();
  }
  async buscarPadre() {
    await this.paramService.obtenerListaPadres(this.tipoPadre).subscribe((result) => {
      this.padres = result;
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
