import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SolicitudesCreditosService} from '../solicitudes-creditos.service';
import Decimal from 'decimal.js';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidacionesPropias} from '../../../../../../../utils/customer.validators';

@Component({
  selector: 'app-valores-proceso',
  templateUrl: './valores-proceso.component.html',
  styleUrls: ['./valores-proceso.component.scss']
})
export class ValoresProcesoComponent implements OnInit {

  @Input() credito;
  @Output() pantalla = new EventEmitter<number>();

  // Formulario
  public submitted = false;
  public cargando = false;
  public actualizarCreditoForm: FormGroup;
  public actualizarCreditoFormData;
  private soltero: boolean;
  private casaPropia: boolean;
  private userViewData: any;
  private ocupacionSolicitante: any;
  private referenciasSolicitante: any;
  private ingresosSolicitante: any;
  private gastosSolicitante: any;
  private empresa: any;
  private casado: boolean;
  public formSolicitud: FormGroup;
  public formConyuge: FormGroup;
  public microEmpresa = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _solicitudCreditosService: SolicitudesCreditosService,
    private modalService: NgbModal,
  ) {  }

  ngOnInit(): void {
    this.actualizarCreditoFormData = new FormData();
    this.actualizarCreditoForm = this._formBuilder.group({
      id: [this.credito._id, [Validators.required]],
      monto: [this.credito.monto, [Validators.required]],
      montoAprobado: [this.credito.montoAprobado, [Validators.required]],
      gastosAdministrativos: [this.credito.gastosAdministrativos, [Validators.required]],
      montoLiquidar: [this.credito.montoLiquidar, [Validators.required]],
      montoDisponible: [this.credito.montoLiquidar, [Validators.required]],
      solicitudCredito: [this.credito.solicitudCredito],
      pagare: ['', [Validators.required, ValidacionesPropias.pdfValido]],
      contratosCuenta: ['', [Validators.required, ValidacionesPropias.pdfValido]],
      tablaAmortizacion: ['', [Validators.required, ValidacionesPropias.pdfValido]],
    });
    console.log('this.credito', this.credito);
    if (this.credito.empresaInfo) {
      this.microEmpresa = true;
    }
  }

  get controlsFrom() {
    return this.actualizarCreditoForm.controls;
  }

  subirDoc(event, key) {
    if (event.target.files && event.target.files[0]) {
      const doc = event.target.files[0];
      this.actualizarCreditoFormData.delete(`${key}`);
      this.actualizarCreditoFormData.append(`${key}`, doc, Date.now() + '_' + doc.name);
    }
  }

  actualizarSolicitudCredito(estado) {
    this.submitted = true;
    if (this.actualizarCreditoForm.invalid) {
      console.log('form', this.actualizarCreditoForm);
      return;
    }
    this.cargando = true;
    const creditoValores = Object.values(this.actualizarCreditoForm.value);
    const creditoLlaves = Object.keys(this.actualizarCreditoForm.value);
    const remover = ['buroCredito', 'evaluacionCrediticia', 'identificacion', 'papeletaVotacion', 'identificacionConyuge', 'mecanizadoIess',
      'papeletaVotacionConyuge', 'planillaLuzNegocio', 'planillaLuzDomicilio', 'facturas', 'matriculaVehiculo', 'impuestoPredial', 'fotoCarnet',
      'solicitudCredito', 'buroCreditoIfis', 'pagare', 'contratosCuenta', 'tablaAmortizacion'];
    creditoLlaves.map((llaves, index) => {
      if (creditoValores[index] && !remover.find((item: any) => item === creditoLlaves[index])) {
        this.actualizarCreditoFormData.delete(llaves);
        this.actualizarCreditoFormData.append(llaves, creditoValores[index]);
      }
    });
    this._solicitudCreditosService.actualizarSolictudesCreditos(this.actualizarCreditoFormData).subscribe((info) => {
        console.log('se guardo los valores proceso');
        this.cargando = false;
        this.pantalla.emit(4);
      },
      (error) => {
        this.cargando = false;
      });
  }

  calcularMontoLiquidar() {
    const montoAprobado = this.actualizarCreditoForm.get('montoAprobado').value || 0;
    const gastosAdministrativos = this.actualizarCreditoForm.get('gastosAdministrativos').value || 0;
    const montoLiquidar = new Decimal(montoAprobado).add(gastosAdministrativos).toNumber();
    this.actualizarCreditoForm.get('montoLiquidar').setValue(montoLiquidar);
    this.actualizarCreditoForm.get('montoDisponible').setValue(montoLiquidar);
  }

  viewDataUser(modal) {
    this.credito = this.credito;
    const user = this.credito.user;
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

  viewDataUserMicroCredito(modal) {
    const infoEmpresa = this.credito.empresaInfo;
    this.empresa = infoEmpresa;
    console.log('infoEmpresa', infoEmpresa);
    this.declareFormularios();
    this.declareFormConyuge();
    this.modalOpenSLC(modal);
    this.casado = (infoEmpresa.estadoCivil === 'Casad@' || infoEmpresa.estadoCivil === 'Casado' || infoEmpresa.estadoCivil === 'Unión libre');
    infoEmpresa?.familiares.forEach(item => this.agregarFamiliar());
    this.formSolicitud.patchValue({...infoEmpresa});
  }

  declareFormularios() {
    this.formSolicitud = this._formBuilder.group(
      {
        reprsentante: ['', [Validators.required]], //
        rucEmpresa: ['', [Validators.required]], //
        comercial: ['', [Validators.required]], //
        actividadEconomica: ['', [Validators.required]], //
        direccionDomiciolRepresentante: ['', [Validators.required]], //
        direccionEmpresa: ['', [Validators.required]], //
        referenciaDomicilio: ['', [Validators.required]], //
        refenciaNegocio: ['', [Validators.required]], //
        esatdo_civil: ['', [Validators.required]], //
        correo: ['', [Validators.required]], //
        telefono: ['', [Validators.required]], //
        celular: ['', [Validators.required]], //
        conyuge: this._formBuilder.group({
          nombreConyuge: [''], //
          telefonoConyuge: [''], //
          correoConyuge: [''],
        }),
        familiares: this._formBuilder.array([]),
        inresosMensualesVentas: ['', [Validators.required]], //
        sueldoConyuge: [''], //
        otrosIngresos: [''], //
        gastosMensuales: ['', [Validators.required]], //
        gastosFamilaires: ['', [Validators.required]], //
        especificaIngresos: [''], //
      });
  }

  get familiares() {
    return this.formSolicitud.controls['familiares'] as FormArray;
  }

  agregarFamiliar() {
    const cuentaForm = this._formBuilder.group({
      nombreFamiliar: [''], //
      apellidoFamiliar: [''], //
      telefonoFamiliar: [''], //
      direccionFamiliar: [''],
      tipoPariente: [''],
    });
    this.familiares.push(cuentaForm);
  }

  declareFormConyuge() {
    this.formConyuge = this._formBuilder.group({
      nombreConyuge: [''], //
      telefonoConyuge: [''], //
      correoConyuge: [''],
    });
  }

  modalOpenSLC(modalSLC) {
    this.modalService.open(modalSLC, {
        centered: true,
        size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
      }
    );
  }
}
