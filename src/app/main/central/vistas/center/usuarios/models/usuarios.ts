import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class Usuario {
    id: string;
    email: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    whatsapp: string;
    cargo: string;
    fechaNacimiento: string;
    genero: string;
    // password: string;
    roles: string;
    estado:string;
}
export const compararPassword:ValidatorFn= (control: AbstractControl):ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
  
    return password && passwordConfirm && password.value === passwordConfirm.value ? { samePassword: true } : null;
  };
