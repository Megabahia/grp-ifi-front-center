import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AuthenticationService} from 'app/auth/service';
import moment from 'moment';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    /**
     *
     * @param {Router} _router
     * @param {AuthenticationService} _authenticationService
     */
    constructor(private _router: Router, private _authenticationService: AuthenticationService) {
    }

    // canActivate
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const grpSanjoseCenterUser = this._authenticationService.grpSanjoseCenterUserValue;
        let activacion = false;
        if (grpSanjoseCenterUser) {
            // check if route is restricted by role
            let rolEncontrado = false;
            let expiracionToken = Number(grpSanjoseCenterUser.tokenExpiracion);
            let fechaActual = Date.now();
            if (expiracionToken - fechaActual <= 0) {
                this._authenticationService.logout();
            }


            // console.log(fechaActual.diff());

            grpSanjoseCenterUser.roles.map(rol => {
                if (route.data.roles && route.data.roles.indexOf(rol.nombre) != -1) {
                    rolEncontrado = true;
                }
            });

            if (!JSON.parse(grpSanjoseCenterUser.roles[0].config).includes(state.url.slice(1))) {
                this._router.navigate(['/pages/miscellaneous/not-authorized']);
                return false;
            } else {
                return true;
            }


            // if (route.data.activacion) {
            //   if (route.data.activacion.indexOf(Number(grpSanjoseCenterUser.estado)) != -1) {
            //     activacion = true;
            //   }
            // }
            // switch (Number(grpSanjoseCenterUser.estado)) {
            //   case 1: {
            //     if (!activacion) {
            //       this._router.navigate(['/personas/bienvenido']);
            //     }
            //     return true;
            //   }
            //   case 2: {
            //     if (!activacion) {
            //       this._router.navigate(['/personas/completarPerfil']);
            //     }
            //     return true;
            //   }
            //   case 3: {
            //     if (!activacion) {
            //       this._router.navigate(['/personas/completarPerfil']);
            //     }
            //     return true;
            //   }
            //   case 4: {
            //     if (!activacion) {
            //       this._router.navigate(['/personas/felicidadesRegistro']);
            //     }
            //     return true;
            //   }
            // }

            if (route.data.roles && !rolEncontrado) {
                // role not authorised so redirect to not-authorized page
                this._router.navigate(['/pages/miscellaneous/not-authorized']);
                return false;
            }


            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this._router.navigate(['/grp/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
