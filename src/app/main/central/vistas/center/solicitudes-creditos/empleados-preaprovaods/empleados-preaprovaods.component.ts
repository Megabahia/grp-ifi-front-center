import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SolicitudesCreditosService} from '../solicitudes-creditos.service';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-empleados-preaprovaods',
  templateUrl: './empleados-preaprovaods.component.html',
  styleUrls: ['./empleados-preaprovaods.component.scss'],
  providers: [DatePipe],
})
export class EmpleadosPreaprovaodsComponent implements OnInit, AfterViewInit {

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
      tipoCredito: 'Empleado-PreAprobado',
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
      checkFotoCarnet: ['', [Validators.requiredTrue]],
      checkPapeletaVotacion: ['', [Validators.requiredTrue]],
      checkIdentificacionConyuge: ['', this.soltero ? [] : [Validators.requiredTrue]],
      checkPapeletaVotacionConyuge: ['', this.soltero ? [] : [Validators.requiredTrue]],
      checkPlanillaLuzDomicilio: ['', [Validators.requiredTrue]],
      checkMecanizadoIess: ['', [Validators.requiredTrue]],
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
    this.submitted = true;
    if (this.actualizarCreditoForm.invalid) {
      console.log('if');
      return;
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
      {'label': 'Identificacion', 'valor': resto.checkIdenficicacion},
      {'label': 'Foto Carnet', 'valor': resto.checkFotoCarnet},
      {'label': 'Papeleta votacion', 'valor': resto.checkPapeletaVotacion},
      {'label': 'Identificacion conyuge', 'valor': resto.checkIdentificacionConyuge},
      {'label': 'Papeleta votacion conyuge', 'valor': resto.checkPapeletaVotacionConyuge},
      {'label': 'Planilla luz domicilio', 'valor': resto.checkPlanillaLuzDomicilio},
      {'label': 'Mecanizado Iess', 'valor': resto.checkMecanizadoIess},
      {'label': 'Matricula vehiculo', 'valor': resto.checkMatriculaVehiculo},
      {'label': 'Impuesto predial', 'valor': resto.checkImpuestoPredial},
      {'label': 'Buro credito', 'valor': resto.checkBuroCredito},
      {'label': 'Calificacion buro', 'valor': resto.checkCalificacionBuro},
      {'label': 'Observación', 'valor': resto.checkObservacion},
    ];
    if (this.soltero) {
      this.checks.splice(3, 2);
    }
    this.cargando = true;
    this.actualizarCreditoFormData.delete('estado');
    this.actualizarCreditoFormData.append('estado', estado);
    this.actualizarCreditoFormData.delete('checks');
    this.actualizarCreditoFormData.append('checks', JSON.stringify(this.checks));
    this._solicitudCreditosService.actualizarSolictudesCreditos(this.actualizarCreditoFormData).subscribe((info) => {
          this.cargando = false;
          if (estado === 'Negado') {
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

}
