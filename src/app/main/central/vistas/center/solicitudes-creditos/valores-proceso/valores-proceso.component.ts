import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SolicitudesCreditosService} from '../solicitudes-creditos.service';

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

  constructor(
    private _formBuilder: FormBuilder,
    private _solicitudCreditosService: SolicitudesCreditosService,
  ) {  }

  ngOnInit(): void {
    this.actualizarCreditoFormData = new FormData();
    this.actualizarCreditoForm = this._formBuilder.group({
      id: [this.credito._id, [Validators.required]],
      monto: [this.credito.monto, [Validators.required]],
      montoAprobado: [this.credito.montoAprobado, [Validators.required]],
      gastosAdministrativos: [this.credito.gastosAdministrativos, [Validators.required]],
      montoLiquidar: [this.credito.montoLiquidar, [Validators.required]],
      solicitudCredito: [this.credito.solicitudCredito],
      pagare: ['', [Validators.required]],
      contratosCuenta: ['', [Validators.required]],
      tablaAmortizacion: ['', [Validators.required]],
    });
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

}
