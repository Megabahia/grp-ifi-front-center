import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { GanarSuperMoneda } from '../models/superMonedas';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RolesService } from '../roles.service';
import { DatePipe } from '@angular/common';
import { CoreSidebarService } from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { MisFacturasService } from '../../../../../personas/vistas/supermonedas/mis-facturas/mis-facturas.service';
import { CoreMenuService } from '../../../../../../../@core/components/core-menu/core-menu.service';
import { ParametrizacionesService } from '../../../center/parametrizaciones/parametrizaciones.service';
import { BienvenidoService } from '../../../../../personas/vistas/bienvenido/bienvenido.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [DatePipe]
})
export class ListarComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('mensajeModal') mensajeModal;

  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public usuario;
  public empresaId;
  public loading = false;
  public mensaje = "";
  public ganarMonedasFacElec;
  public ganarMonedasFacFisi;
  public submittedFactura = false;
  public superMonedasElec: GanarSuperMoneda;
  public nombreFacElec = "";
  public nombreFacFisi = "";
  public categoriaEmpresaOpciones;
  public facFisiForm: FormGroup;
  public archivoFacElec = new FormData();
  public facFisiFormData = new FormData();
  public facturas;
  public paisOpciones;
  public provinciaOpciones;
  public ciudadOpciones;
  public fecha;
  public listaSupermonedas;
  private _unsubscribeAll: Subject<any>;
  public startDateOptions: FlatpickrOptions = {
    defaultDate: 'today',
    altInput: true,
    mode: 'single',
    altFormat: 'Y-n-j',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
  };
  constructor(
    private _misFacturasService: MisFacturasService,
    private datePipe: DatePipe,
    private _coreSidebarService: CoreSidebarService,
    private _coreMenuService: CoreMenuService,
    private paramService: ParametrizacionesService,
    private _bienvenidoService: BienvenidoService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.usuario = this._coreMenuService.grpCenterUser;

    this.superMonedasElec = this.inicializarSuperMoneda();

    this._unsubscribeAll = new Subject();

  }
  inicializarSuperMoneda(): GanarSuperMoneda {
    return {
      credito: 0,
      descripcion: "",
      tipo: "Credito",
      user_id: this.usuario.id,
      empresa_id: this.empresaId
    }
  }

  get FFForm() {
    return this.facFisiForm.controls;
  }

  ngOnInit(): void {

    this.facFisiForm = this._formBuilder.group({
      razonSocial: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      fechaEmision: ['', [Validators.required]],
      importeTotal: [0, [Validators.required]],
      categoria: ['', [Validators.required]],
      urlFoto: ['', [Validators.required]],
    });
    this.obtenerEmpresaId();

    this.obtenerCategoriaEmpresaOpciones();
    this.fecha = this.transformarFecha(new Date());

    this.usuario = this._coreMenuService.grpCenterUser;


    this.cdRef.detectChanges();
  }
  obtenerListaSupermonedas() {
    this._misFacturasService.obtenerSupermonedas({
      page: this.page - 1, page_size: this.page_size,
    }).subscribe((info) => {
      this.listaSupermonedas = info.info;
      this.collectionSize = info.cont;
    });
  }
  obtenerEmpresaId() {
    this._bienvenidoService.obtenerEmpresa({
      nombreComercial: "Global Red Pyme"
    }).subscribe((info) => {
      this.superMonedasElec.empresa_id = info._id;
    }, (error) => {
      this.mensaje = "Ha ocurrido un error al actualizar su imagen";
      this.abrirModal(this.mensajeModal);
    });
  }
  ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaSupermonedas();
    // this.cdRef.detectChanges();
  }

  toggleSidebar(name): void {
    if (name == "factura-electronica") {
      this.nombreFacElec = "";
      this.archivoFacElec = new FormData();
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  obtenerCategoriaEmpresaOpciones() {
    this.paramService.obtenerListaPadres("CATEGORIA_EMPRESA").subscribe((info) => {
      this.categoriaEmpresaOpciones = info;
    });
  }

  obtenerListaFacturas() {
    this._misFacturasService.obtenerFacturas({
      page: this.page - 1, page_size: this.page_size, user_id: this.usuario.id
    }).subscribe(info => {
      this.facturas = info.info;
      this.collectionSize = info.cont;
    });
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
  cargarFacturaElec(event: any) {
    if (event.target.files && event.target.files[0]) {
      let archivo = event.target.files[0];
      this.nombreFacElec = archivo.name;

      this.archivoFacElec = new FormData();
      this.archivoFacElec.delete('documento');
      this.archivoFacElec.append('documento', archivo, Date.now() + "_" + archivo.name);
    }
  }
  visualizarNombreArchivo(nombre) {
    let stringArchivos = 'https://globalredpymes.s3.amazonaws.com/CENTRAL/archivosFacturas/';
    let stringImagenes = 'https://globalredpymes.s3.amazonaws.com/CENTRAL/imgFacturas/';
    if (nombre.includes(stringArchivos)) {
      return nombre.replace('https://globalredpymes.s3.amazonaws.com/CENTRAL/archivosFacturas/', '');
    } else if (nombre.includes(stringImagenes)) {
      return nombre.replace('https://globalredpymes.s3.amazonaws.com/CENTRAL/imgFacturas/', '');
    }
  }
  subirFacturaElec() {
    if (this.nombreFacElec) {
      this.loading = true;
      this.archivoFacElec.append('user_id', this.usuario.id);
      this._misFacturasService.asignarSuperMonedas(this.archivoFacElec).subscribe((info) => {
        this.loading = false;
        this.obtenerListaSupermonedas();
        this.toggleSidebar("factura-electronica");
        this.mensaje = "Supermonedas asignadas correctamente";
        this.abrirModal(this.mensajeModal);
      },
        (error) => {
          this.loading = false;

          this.mensaje = "Ha ocurrido un error al cargar su factura";
          this.abrirModal(this.mensajeModal);
        });
    } else {
      this.loading = false;

      this.mensaje = "Es necesario cargar un archivo tipo PDF o XML";
      this.abrirModal(this.mensajeModal);
    }
  }
  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaSupermonedas();
    });
  }

  async subirImagen(event) {

    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      this.facFisiFormData.delete('documento');
      this.facFisiFormData.append('documento', imagen, imagen.name);
    }
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
