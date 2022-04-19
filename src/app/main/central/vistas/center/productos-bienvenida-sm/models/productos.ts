import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class Producto {
    _id: string;
    nombre: string;
    marca?: string;
    precioNormal: number;
    precioSupermonedas: number;
    efectivo: number;
    codigoQR?: string;
    cantidad: number;
    empresa_id: string;
    vigencia?: string;
    tipo: string;
    imagen: string;
    codigoDescuento: string;
    empresaAplica_id: string;
}
