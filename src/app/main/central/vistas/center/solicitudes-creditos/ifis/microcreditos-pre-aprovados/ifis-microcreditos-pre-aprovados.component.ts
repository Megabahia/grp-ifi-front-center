import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SolicitudesCreditosService} from '../../solicitudes-creditos.service';
import {CoreSidebarService} from '../../../../../../../../@core/components/core-sidebar/core-sidebar.service';

@Component({
    selector: 'app-microcreditos-pre-aprovados',
    templateUrl: './ifis-microcreditos-pre-aprovados.component.html',
    styleUrls: ['./ifis-microcreditos-pre-aprovados.component.scss'],
    providers: [DatePipe],

})
export class IfisMicrocreditosPreAprovadosComponent implements OnInit, AfterViewInit {

    @ViewChild(NgbPagination) paginator: NgbPagination;
    public page = 1;
    public page_size: any = 4;
    public maxSize;
    public empresa;
    public collectionSize;
    public formSolicitud: FormGroup;
    public formConyuge: FormGroup;
    public casado = false;
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
    public checks = [];
    public checksSolteroInferior: any = [];
    public checksSolteroSuperior: any = [];
    public checksCasadoInferior: any = [];
    public checksCasadoSuperior: any = [];
    public montoLimite: any = 8000;
    public remover = ['buroCredito', 'evaluacionCrediticia', 'identificacion', 'papeletaVotacion',
        'identificacionConyuge', 'mecanizadoIess', 'papeletaVotacionConyuge', 'planillaLuzNegocio',
        'planillaLuzDomicilio', 'facturas', 'matriculaVehiculo', 'impuestoPredial', 'fotoCarnet',
        'solicitudCredito', 'buroCreditoIfis', 'facturasVentas2meses', 'facturasVentasCertificado', 'facturasPendiente'];
    // Formulario
    public soltero = false;
    public actualizarCreditoForm: FormGroup;
    public submitted = false;
    public cargando = false;
    public actualizarCreditoFormData;
  public ingresoNegocioSuperior = false;
  private motivo: string;
  private estadoCredito: any;

    constructor(
        private _solicitudCreditosService: SolicitudesCreditosService,
        private modalService: NgbModal,
        private _coreSidebarService: CoreSidebarService,
        private _formBuilder: FormBuilder,
        private datePipe: DatePipe,
    ) {
      this._solicitudCreditosService.obtenerRequisitosCreditoPreAprobado({tipo: 'MICROCREDITO_CASADO_UNION_LIBRE'}).subscribe((item) => {
        item.map((fila) => {
          if (fila.valor === 'INFERIOR') {
            this.checksCasadoInferior = fila.config.map((index) => {
              return {'label': index, 'valor': false};
            });
          }
          if (fila.valor === 'SUPERIOR') {
            this.checksCasadoSuperior = fila.config.map((index) => {
              return {'label': index, 'valor': false};
            });
          }
        });
      });
      this._solicitudCreditosService.obtenerRequisitosCreditoPreAprobado({tipo: 'MICROCREDITO_SOLTERO_DIVORCIADO'}).subscribe((item) => {
        item.map((fila) => {
          if (fila.valor === 'INFERIOR') {
            this.checksSolteroInferior = fila.config.map((index) => {
              return {'label': index, 'valor': false};
            });
          }
          if (fila.valor === 'SUPERIOR') {
            this.checksSolteroSuperior = fila.config.map((index) => {
              return {'label': index, 'valor': false};
            });
          }
        });
      });
      this._solicitudCreditosService.obtenerParametroNombreTipo('MONTO', 'REQUISITOS_MICROCREDIOS').subscribe((item) => {
        this.montoLimite = item.valor;
      });
    }

    ngOnInit(): void {
        this.declareFormularios();
    }

    declareFormularios() {
        this.formSolicitud = this._formBuilder.group(
            {
                reprsentante: ['', [Validators.required]], //
                rucEmpresa: ['', [Validators.required]], //
                comercial: ['', [Validators.required]], //
                actividadEconomica: ['', [Validators.required]], //
                direccionDomiciolRepresentante: ['', [Validators.required]], //
                callePrincipal: ['', [Validators.required]],
                calleSecundaria: ['', [Validators.required]],
                refenciaNegocio: ['', [Validators.required]],
                esatdo_civil: ['', [Validators.required]], //
                correo: ['', [Validators.required]], //
                telefono: ['', [Validators.required]], //
                celular: ['', [Validators.required]], //
                conyuge: this._formBuilder.group({
                    nombreConyuge: [''], //
                    telefonoConyuge: [''], //
                    cedulaConyuge: [''],
                }),
                familiares: this._formBuilder.array([]),
                comerciales: this._formBuilder.array([
                this._formBuilder.group({
                  nombresDuenoComercial: [''],
                  negocioDuenoComercial: [''],
                  telefonoDuenoComercial: [''],
                  direccionDuenoComercial: [''],
                }),
                this._formBuilder.group({
                  nombresDuenoComercial: [''],
                  negocioDuenoComercial: [''],
                  telefonoDuenoComercial: [''],
                  direccionDuenoComercial: [''],
                }),
                this._formBuilder.group({
                  nombresDuenoComercial: [''],
                  negocioDuenoComercial: [''],
                  telefonoDuenoComercial: [''],
                  direccionDuenoComercial: [''],
                }),
              ]),
                inresosMensualesVentas: ['', [Validators.required]], //
                sueldoConyuge: [''], //
                otrosIngresos: [''], //
                gastosMensuales: ['', [Validators.required]], //
                gastosFamilaires: ['', [Validators.required]], //
                especificaIngresos: [''], //
            });
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
            tipoCredito: 'Pymes-PreAprobado',
            cargarOrigen: 'IFIS',
        }).subscribe(info => {
            console.log('info', info);
            this.collectionSize = info.cont;
            this.listaCreditos = info.info;
        });
    }

    declareFormConyuge() {
        this.formConyuge = this._formBuilder.group({
            nombreConyuge: [''], //
            telefonoConyuge: [''], //
            correoConyuge: [''],
        });
    }

    get controlsContuge() {
        return this.formSolicitud.controls['conyuge'] as FormGroup;
    }

    isObjectEmpty(obj) {
      return !!Object.keys(obj).length;
    }

    viewDataUser(modal, empresa) {
        const infoEmpresa = empresa;
        this.empresa = infoEmpresa;
        console.log('infoEmpresa', infoEmpresa);
        this.declareFormularios();
        this.declareFormConyuge();
        this.modalOpenSLC(modal);
        this.casado = infoEmpresa.esatdo_civil ? true : false;
        infoEmpresa?.familiares.forEach(item => this.agregarFamiliar());
        this.formSolicitud.patchValue({...infoEmpresa});
        // this.formConyuge.patchValue({...infoEmpresa.conyuge});
        // this.referenciasSolicitante = JSON.parse(empresa.referenciasSolicitante);
        // this.ingresosSolicitante = JSON.parse(empresa.ingresosSolicitante);
        // this.gastosSolicitante = JSON.parse(user.gastosSolicitante);
    }

    get familiares() {
        return this.formSolicitud.controls['familiares'] as FormArray;
    }
    agregarFamiliar() {
        const cuentaForm = this._formBuilder.group({
          tipoPariente: [''],
          nombreFamiliar: [''],
          apellidoFamiliar: [''],
          telefonoFamiliar: [''],
          direccionFamiliar: [''],
        });
        this.familiares.push(cuentaForm);
    }
    verDocumentos(credito) {
        this.credito = credito;
        console.log('credito', this.credito);
        this.submitted = false;
        this.actualizarCreditoFormData = new FormData();
        this.pantalla = 1;
        this.soltero = (credito.estadoCivil === 'Solter@' || credito.estadoCivil === 'Soltero' ||
          credito.user.estadoCivil === 'Solter@' || credito.user.estadoCivil === 'Divorciado' ||
          credito.estadoCivil === 'Divorciad@' || credito.estadoCivil === 'Divorciado');
      this.ingresoNegocioSuperior = (credito.monto >= this.montoLimite);
        this.actualizarCreditoForm = this._formBuilder.group(
            {
                id: [credito._id, [Validators.required]],
                solicitudCredito: ['', [Validators.required]], //
                evaluacionCrediticia: ['', [Validators.required]], //
                codigoClienteCreado: [this.credito.codigoClienteCreado ? this.credito.codigoClienteCreado : '', [Validators.required]], //
                codigoCuentaCreada: [this.credito.codigoCuentaCreada ? this.credito.codigoCuentaCreada : '', [Validators.required]], //
                buroCreditoIfis: ['', [Validators.required]], //
                calificacionBuroIfis: [this.credito.calificacionBuroIfis ? this.credito.calificacionBuroIfis : '', [Validators.required]], //
                calificacionBuro: [this.credito.calificacionBuro ? this.credito.calificacionBuro : '', [Validators.required]], //
                // fotoCarnet: ['', [Validators.required]], //
                // papeletaVotacion: ['', [Validators.required]], //
                // identificacionConyuge: ['', [Validators.required]], //
                // papeletaVotacionConyuge: ['', [Validators.required]], //
                // planillaLuzDomicilio: ['', [Validators.required]], //
                // planillaLuzNegocio: ['', [Validators.required]], //
                // facturasVentas2meses: ['', [Validators.required]], //
                // facturasVentasCertificado: ['', [Validators.required]], //
                // facturasPendiente: ['', [Validators.required]], //
                // matriculaVehiculo: [''], //
                // impuestoPredial: [''], //
                // buroCredito: ['', [Validators.required]], //
                // observacion: [this.credito.observacion ? this.credito.observacion : '', [Validators.required]], //
                // checks
              checkIdentificacion: ['', [Validators.requiredTrue]], //
              checkRuc: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkFotoCarnet: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkPapeletaVotacion: ['', [Validators.requiredTrue]], //
              checkIdentificacionConyuge: ['', !this.soltero ? [Validators.requiredTrue] : []],
              checkPapeletaVotacionConyuge: ['', !this.soltero ? [Validators.requiredTrue] : []],
              checkPlanillaLuzDomicilio: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkPlanillaLuzNegocio: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkFacturasVentas2meses: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkFacturasVentas2meses2: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkFacturasCompras2meses: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkFacturasCompras2meses2: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkFacturasPendiente: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],

              checkNombramientoRepresentante: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkCertificadoSuperintendencia: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkCertificadoPatronales: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkNominaSocios: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkActaJuntaGeneral: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkCertificadoBancario: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkReferenciasComerciales: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkBalancePerdidasGanancias: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkBalanceResultados: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkDeclaracionIva: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkEstadoCuentaTarjeta: ['', this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],

              checkMatriculaVehiculo: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkImpuestoPredial: ['', !this.ingresoNegocioSuperior ? [Validators.requiredTrue] : []],
              checkBuroCredito: ['', [Validators.requiredTrue]],
              checkCalificacionBuro: ['', [Validators.requiredTrue]],
                // checkBuroCredito: ['', [Validators.requiredTrue]], //
                // checkObservacion: ['', [Validators.requiredTrue]], //
                checkSolicitudCredito: ['', [Validators.requiredTrue]], //
                checkEvaluacionCrediticia: ['', [Validators.requiredTrue]], //
                checkCodigoClienteCreado: ['', [Validators.requiredTrue]], //
                checkCodigoCuentaCreada: ['', [Validators.requiredTrue]], //
                checkBuroCreditoIfis: ['', [Validators.requiredTrue]], //
                checkCalificacionBuroIfis: ['', [Validators.requiredTrue]], //
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
      if (this.estadoCredito !== 'Por Completar' && this.estadoCredito !== 'Negado') {
        if (this.actualizarCreditoForm.invalid) {
          console.log(' no valido form', this.actualizarCreditoForm);
          return;
        }
      }
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
        creditoLlaves.map((llaves, index) => {
            if (creditoValores[index] && !this.remover.find((item: any) => item === creditoLlaves[index])) {
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
            {'label': '3 Copias de Facturas de Ventas del negocio de los últimos 2 meses', 'valor': resto.checkfacturasVentas2meses},
            {
                'label': '3 Copias de Facturas de Ventas del último mes o Certificado de la Asociación',
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
          // this.actualizarCreditoFormData.delete('checks');
          // this.actualizarCreditoFormData.append('checks', JSON.stringify(this.checks));
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

        creditoLlaves.map((llaves, index) => {
            if (creditoValores[index] && !this.remover.find((item: any) => item === creditoLlaves[index])) {
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

  cerrarModal() {
    this.modalService.dismissAll();
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
}
