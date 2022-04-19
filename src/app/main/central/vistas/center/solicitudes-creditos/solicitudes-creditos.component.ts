import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudesCreditosService } from './solicitudes-creditos.service';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { CoreSidebarService } from '../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActualizarCredito } from '../../../models/creditos';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-solicitudes-creditos',
  templateUrl: './solicitudes-creditos.component.html',
  styleUrls: ['./solicitudes-creditos.component.scss'],
  providers: [DatePipe]
})
export class SolicitudesCreditosComponent implements OnInit {

  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('mensajeModal') mensajeModal;

  // public
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public mensaje = "";
  public collectionSize;
  private _unsubscribeAll: Subject<any>;
  public submitted = false;

  public listaCreditos;
  public actualizarCreditoForm;
  public reporteBuro;
  public identificacion;
  public ruc;
  public rolesPago;
  public panillaIESS;
  public actualizarCreditoFormData = new FormData();
  public actualizarCredito: ActualizarCredito;
  public cargando = false;

  constructor(
    private _solicitudCreditosService: SolicitudesCreditosService,
    private modalService: NgbModal,
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this._unsubscribeAll = new Subject();
  }

  get tForm() {
    return this.actualizarCreditoForm.controls;
  }

  ngOnInit(): void {
    this.actualizarCreditoForm = this._formBuilder.group({
      reporteBuroCredito: ['', [Validators.required]],
      calificacionBuro: ['', [Validators.required]],
      buroValido: ['', [Validators.required]],
      identificacion: ['', [Validators.required]],
    });
    this.actualizarCredito = this.inicializarActualizarCredito();
  }

  inicializarActualizarCredito(): ActualizarCredito {
    return {
      id: "",
      reporteBuroCredito: "",
      calificacionBuro: "",
      tomarSolicitud: "",
      buroCredito: "",
      identificacion: "",
    }
  }

  ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerSolicitudesCreditos();
  }

  obtenerSolicitudesCreditos() {
    this._solicitudCreditosService.obtenerSolicitudesCreditos({page_size: this.page_size, page: this.page - 1}).subscribe(info => {
      this.collectionSize = info.cont;
      this.listaCreditos = info.info;
    });
  }
  actualizarSolicitudCredito(){
    this.submitted = true;
    if (this.actualizarCreditoForm.invalid) {
      return;
    }
    let creditoValores = Object.values(this.actualizarCredito);
    let creditoLlaves = Object.keys(this.actualizarCredito);
    creditoLlaves.map((llaves, index) => {
      if (creditoValores[index]) {
        this.actualizarCreditoFormData.delete(llaves);
        this.actualizarCreditoFormData.append(llaves, creditoValores[index]);
      }
    });
    this.cargando = true;
    this._solicitudCreditosService.actualizarSolictudesCreditos(this.actualizarCreditoFormData).subscribe((info) => {
      this.cargando = false;
      this.mensaje = "Crédito actualizado con éxito";
      this.cerrarModal('actualizar-credito');
      this.obtenerSolicitudesCreditos();
    },
    (error) => {
      this.cargando = false;
      this.mensaje = "Error al actualizar el crédito";
      this.abrirModal(this.mensajeModal);
    });
  }
  async subirBuroCredito(event) {
    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      this.reporteBuro = imagen.name;
      this.actualizarCreditoFormData.delete('reporteBuro');
      this.actualizarCreditoFormData.append('reporteBuro', imagen, Date.now() + "_" + imagen.name);
    }
  }
  async subirIdentificacion(event) {
    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      this.identificacion = imagen.name;
      this.actualizarCreditoFormData.delete('identificacion');
      this.actualizarCreditoFormData.append('identificacion', imagen, Date.now() + "_" + imagen.name);
    }
  }
  async subirRuc(event) {
    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      this.ruc = imagen.name;
      this.actualizarCreditoFormData.delete('ruc');
      this.actualizarCreditoFormData.append('ruc', imagen, Date.now() + "_" + imagen.name);
    }
  }
  async subirRolesPago(event) {
    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      this.rolesPago = imagen.name;
      this.actualizarCreditoFormData.delete('rolesPago');
      this.actualizarCreditoFormData.append('rolesPago', imagen, Date.now() + "_" + imagen.name);
    }
  }
  async subirPlanillaIESS(event) {
    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      this.panillaIESS = imagen.name;
      this.actualizarCreditoFormData.delete('panillaIESS');
      this.actualizarCreditoFormData.append('panillaIESS', imagen, Date.now() + "_" + imagen.name);
    }
  }
  toggleSidebar(name, id): void {
    if (id) {
      this._solicitudCreditosService.obtenersolicitudCredito(id).subscribe((info) => {
        let {reporteBuro,identificacion,ruc,rolesPago,panillaIESS, ...resto} = info;
        this.actualizarCredito = resto;
        this.actualizarCredito.id = id;
      },
        (error) => {
          this.mensaje = "Error al obtener el crédito";
          this.abrirModal(this.mensajeModal);
        });
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerSolicitudesCreditos();
    });
  }
  abrirModal(modal) {
    this.modalService.open(modal);
  }
  cerrarModal(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
}
