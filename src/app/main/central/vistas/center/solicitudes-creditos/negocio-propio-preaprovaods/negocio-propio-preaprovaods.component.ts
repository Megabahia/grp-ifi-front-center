import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SolicitudesCreditosService} from '../solicitudes-creditos.service';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-negocio-propio-preaprovaods',
  templateUrl: './negocio-propio-preaprovaods.component.html',
  styleUrls: ['./negocio-propio-preaprovaods.component.scss'],
  providers: [DatePipe],

})
export class NegocioPropioPreaprovaodsComponent  implements OnInit, AfterViewInit {

@ViewChild(NgbPagination) paginator: NgbPagination;

public page = 1;
public page_size: any = 4;
public maxSize;
public collectionSize;
private _unsubscribeAll: Subject<any>;

  // Variables
public listaCreditos;
public userViewData;
private ocupacionSolicitante;
public referenciasSolicitante;
public ingresosSolicitante;
public gastosSolicitante;
public pantalla = 0;
public credito;
public checks = [
    {'label': 'Identificacion', 'valor': false},
    {'label': 'Foto Carnet', 'valor': false},
    {'label': 'Papeleta votacion', 'valor': false},
    {'label': 'Identificacion conyuge', 'valor': false},
    {'label': 'Papeleta votacion conyuge', 'valor': false},
    {'label': 'Planilla luz domicilio', 'valor': false},
    {'label': 'Mecanizado Iess', 'valor': false},
    {'label': 'Matricula vehiculo', 'valor': false},
    {'label': 'Impuesto predial', 'valor': false},
    {'label': 'Buro credito', 'valor': false},
    {'label': 'Calificacion buro', 'valor': false},
    {'label': 'Observación', 'valor': false},
  ];
  // Formulario
public soltero = false;
public actualizarCreditoForm: FormGroup;
public submitted = false;
public cargando = false;
public actualizarCreditoFormData;
  public casaPropia = false;
  private motivo: string;
  private estadoCredito: any;

  constructor(
      private _solicitudCreditosService: SolicitudesCreditosService,
      private modalService: NgbModal,
      private _coreSidebarService: CoreSidebarService,
      private _formBuilder: FormBuilder,
      private datePipe: DatePipe,
) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerSolicitudesCreditos();
  }

  get controlsFrom() {
    return this.actualizarCreditoForm.controls;
  }

  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerSolicitudesCreditos();
    });
  }

  transformarFecha(fecha) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }

  modalOpenSLC(modalSLC) {
    this.modalService.open(modalSLC, {
          centered: true,
          size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
        }
    );
  }

  obtenerSolicitudesCreditos() {
    this._solicitudCreditosService.obtenerSolicitudesCreditos({
      page_size: this.page_size,
      page: this.page - 1,
      tipoCredito: 'Negocio-PreAprobado',
      cargarOrigen: 'BIGPUNTOS'
    }).subscribe(info => {
      this.collectionSize = info.cont;
      this.listaCreditos = info.info;
    });
  }

  viewDataUser(modal, credito) {
    this.credito = credito;
    const user = credito.user;
    this.soltero = (user.estadoCivil === 'Solter@' || user.estadoCivil === 'Soltero' ||
      user.estadoCivil === 'Divorciad@' || user.estadoCivil === 'Divorciado');
    this.casaPropia = (user.tipoVivienda === 'Propia');
    this.modalOpenSLC(modal);
    this.userViewData = user;
    this.ocupacionSolicitante = user.ocupacionSolicitante;
    this.referenciasSolicitante = user.referenciasSolicitante;
    this.ingresosSolicitante = user.ingresosSolicitante;
    this.gastosSolicitante = user.gastosSolicitante;
  }

  verDocumentos(credito) {
    this.credito = credito;
    this.submitted = false;
    this.actualizarCreditoFormData = new FormData();
    this.pantalla = 1;
    this.soltero = (credito.estadoCivil === 'Solter@' || credito.estadoCivil === 'Soltero' ||
      credito.user.estadoCivil === 'Solter@' || credito.user.estadoCivil === 'Divorciado' ||
      credito.estadoCivil === 'Divorciad@' || credito.estadoCivil === 'Divorciado');
    console.log(this.soltero, 'this.soltero');
    this.actualizarCreditoForm = this._formBuilder.group({
      id: [credito._id, [Validators.required]],
      solicitudCredito: ['', [Validators.required]],
      evaluacionCrediticia: ['', [Validators.required]],
      codigoClienteCreado: ['', [Validators.required]],
      codigoCuentaCreada: ['', [Validators.required]],
      buroCreditoIfis: ['', [Validators.required]],
      calificacionBuroIfis: ['', [Validators.required]],
      calificacionBuro: [credito.calificacionBuro],
      observacion: [credito.observacion],
      checkSolicitudCredito: ['', [Validators.requiredTrue]],
      checkEvaluacionCrediticia: ['', [Validators.requiredTrue]],
      checkCodigoClienteCreado: ['', [Validators.requiredTrue]],
      checkCodigoCuentaCreada: ['', [Validators.requiredTrue]],
      checkBuroCreditoIfis: ['', [Validators.requiredTrue]],
      checkCalificacionBuroIfis: ['', [Validators.requiredTrue]],
      checkBuroRevisado: ['', [Validators.requiredTrue]],
      checkIdenficicacion: ['', [Validators.requiredTrue]],
      checkRuc: ['', [Validators.requiredTrue]],
      checkPapeletaVotacion: ['', [Validators.requiredTrue]],
      checkIdentificacionConyuge: ['', this.soltero ? [] : [Validators.requiredTrue]],
      checkPapeletaVotacionConyuge: ['', this.soltero ? [] : [Validators.requiredTrue]],
      checkPlanillaLuzNegocio: ['', [Validators.requiredTrue]],
      checkPlanillaLuzDomicilio: ['', [Validators.requiredTrue]],
      checkfacturasVentas2meses: ['', [Validators.requiredTrue]],
      checkfacturasVentas2meses2: ['', [Validators.requiredTrue]],
      checkfacturasVentas2meses3: ['', [Validators.requiredTrue]],
      checkMatriculaVehiculo: [''],
      checkImpuestoPredial: [''],
      checkBuroCredito: ['', [Validators.requiredTrue]],
      checkCalificacionBuro: ['', [Validators.requiredTrue]],
      checkObservacion: ['', [Validators.requiredTrue]],
    });
    console.log('tipo de checks', typeof credito.checks);
    this.checks = (typeof credito.checks === 'object') ? credito.checks : JSON.parse(credito.checks);
  }

  cambiarEstado($event) {
    this.pantalla = $event;
  }

  cancelar() {
    this.pantalla = 0;
  }

  subirDoc(event, key) {
    if (event.target.files && event.target.files[0]) {
      const doc = event.target.files[0];
      this.actualizarCreditoFormData.delete(`${key}`);
      this.actualizarCreditoFormData.append(`${key}`, doc, Date.now() + '_' + doc.name);
    }
  }

  actualizarSolicitudCredito(estado?: string) {
    console.log('llega---', this.actualizarCreditoForm);
    this.submitted = true;
    if (this.estadoCredito !== 'Por Completar' && this.estadoCredito !== 'Negado') {
      if (this.actualizarCreditoForm.invalid) {
        console.log(' no valido form');
        return;
      }
    }
    console.log('paso');
    const {
      id,
      identificacion,
      fotoCarnet,
      papeletaVotacion,
      identificacionConyuge,
      papeletaVotacionConyuge,
      planillaLuzDomicilio,
      mecanizadoIess,
      matriculaVehiculo,
      impuestoPredial,
      buroCredito,
      calificacionBuro,
      observacion, ...resto
    } = this.actualizarCreditoForm.value;
    const creditoValores = Object.values(this.actualizarCreditoForm.value);
    const creditoLlaves = Object.keys(this.actualizarCreditoForm.value);
    const remover = ['buroCredito', 'evaluacionCrediticia', 'identificacion', 'papeletaVotacion', 'identificacionConyuge', 'mecanizadoIess',
      'papeletaVotacionConyuge', 'planillaLuzNegocio', 'planillaLuzDomicilio', 'facturas', 'matriculaVehiculo', 'impuestoPredial', 'fotoCarnet',
      'solicitudCredito', 'buroCreditoIfis'];
    creditoLlaves.map((llaves, index) => {
      if (creditoValores[index] && !remover.find((item: any) => item === creditoLlaves[index])) {
        this.actualizarCreditoFormData.delete(llaves);
        this.actualizarCreditoFormData.append(llaves, creditoValores[index]);
      }
    });
    this.checks = [
      {'label': 'identificacion', 'valor': resto.checkIdentificacion},
      {'label': 'Foto Carnet', 'valor': resto.checkFotoCarnet},
      {'label': 'Ruc', 'valor': resto.checkIdentificacion},
      {'label': 'Papeleta votación Representante Legal ', 'valor': resto.checkPapeletaVotacion},
      {'label': 'Identificacion conyuge', 'valor': resto.checkIdentificacionConyuge},
      {'label': 'Papeleta votacion conyuge', 'valor': resto.checkPapeletaVotacionConyuge},
      {'label': 'Planilla luz Domicilio', 'valor': resto.checkPlanillaLuzDomicilio},
      {'label': 'Planilla luz Negocio', 'valor': resto.checkPlanillaLuzNegocio},
      {'label': 'Copia de factura de venta del ultimo mes', 'valor': resto.checkfacturasVentas2meses},
      {'label': 'Copia de factura de venta del penúltimo mes (hace dos meses)', 'valor': resto.checkfacturasVentas2meses2},
      {'label': 'Copia de factura del antepenúltimo mes (hace tres meses)', 'valor': resto.checkfacturasVentas2meses3},
      {
        'label': 'Certificado de la Asociación (este campo aplica si usted es transportista: Bus o Taxi)',
        'valor': resto.checkfacturasVentasCertificado
      },
      {'label': 'Facturas pendiente de pago', 'valor': resto.checkFacturasPendiente},
      {'label': 'Justificación otros ingresos mensuales ', 'valor': resto.checkMatriculaVehiculo}, // no hay
      {'label': 'Matricula vehiculo', 'valor': resto.checkMatriculaVehiculo},
      {'label': 'Copia de pago impuesto predial o copia de escrituras', 'valor': resto.checkImpuestoPredial},
      {'label': 'Registro de Referencias Familiares y Comerciales.', 'valor': resto.checkImpuestoPredial}, // no hay
      {'label': 'Buro credito', 'valor': resto.checkBuroCredito},
    ];
    if (this.soltero) {
      this.checks.splice(3, 2);
    }
    this.cargando = true;
    this.actualizarCreditoFormData.delete('estado');
    this.actualizarCreditoFormData.append('estado', estado);
    this.actualizarCreditoFormData.delete('motivo');
    this.actualizarCreditoFormData.append('motivo', this.motivo);
    if (estado !== 'Por Completar') {
      this.actualizarCreditoFormData.delete('checks');
      this.actualizarCreditoFormData.append('checks', JSON.stringify(this.checks));
    }
    console.log('this.actualizarCreditoFormData', this.actualizarCreditoFormData);
    this._solicitudCreditosService.actualizarSolictudesCreditos(this.actualizarCreditoFormData).subscribe((info) => {
        this.cerrarModal();
        this.cargando = false;
        if (estado === 'Negado' || estado === 'Por Completar') {
          this.pantalla = 0;
        } else {
          this.pantalla = 3;
        }
        this.obtenerSolicitudesCreditos();
        this._solicitudCreditosService.deleteDocumentFirebase(this.actualizarCreditoFormData.get('id'));
        },
        (error) => {
          this.cargando = false;
        });
  }

  actualizarSolicitudCreditoNegado(estado) {
    const creditoValores = Object.values(this.actualizarCreditoForm.value);
    const creditoLlaves = Object.keys(this.actualizarCreditoForm.value);
    const remover = ['buroCredito', 'evaluacionCrediticia', 'identificacion', 'papeletaVotacion', 'identificacionConyuge', 'mecanizadoIess',
      'papeletaVotacionConyuge', 'planillaLuzNegocio', 'planillaLuzDomicilio', 'facturas', 'matriculaVehiculo', 'impuestoPredial', 'fotoCarnet',
      'solicitudCredito', 'buroCreditoIfis'];
    creditoLlaves.map((llaves, index) => {
      if (creditoValores[index] && !remover.find((item: any) => item === creditoLlaves[index])) {
        this.actualizarCreditoFormData.delete(llaves);
        this.actualizarCreditoFormData.append(llaves, creditoValores[index]);
      }
    });
    this.cargando = true;
    this.actualizarCreditoFormData.delete('estado');
    this.actualizarCreditoFormData.append('estado', estado);
    this._solicitudCreditosService.actualizarSolictudesCreditos(this.actualizarCreditoFormData).subscribe((info) => {
          this.cargando = false;
          this.obtenerSolicitudesCreditos();
          this._solicitudCreditosService.deleteDocumentFirebase(this.actualizarCreditoFormData.get('id'));
          if (estado === 'Negado') {
            this.pantalla = 0;
          } else {
            this.pantalla = 3;
          }
        },
        (error) => {
          this.cargando = false;
          if (estado === 'Negado') {
            this.pantalla = 0;
          }
        });
  }

  abrirModalMotivo(modalMotivo, estadoCredito) {
    if (estadoCredito === 'Aprobado') {
      console.log('form', this.actualizarCreditoForm);
      this.submitted = true;
      if (this.actualizarCreditoForm.invalid) {
        console.log('invalid Form');
        return;
      }
    }
    this.motivo = '';
    this.estadoCredito = estadoCredito;
    this.modalService.open(modalMotivo, {
        centered: true,
        size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
      }
    );
  }

  cerrarModal() {
    this.modalService.dismissAll();
  }
}
