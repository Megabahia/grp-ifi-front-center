import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './vistas/principal/principal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { RouterModule } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '@core/components';
import { AuthGuard } from '../../auth/helpers/auth.guards';
import { Role } from '../../auth/models/role';
import 'flatpickr/dist/flatpickr.css'; // you may need to adjust the css import depending on your build tool
import { FlatpickrModule } from 'angularx-flatpickr';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CardSnippetModule } from '../../../@core/components/card-snippet/card-snippet.module';
import { PerfilUsuarioComponent } from '../center/perfil-usuario/perfil-usuario.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { QRCodeModule } from 'angularx-qrcode';
import { ListarComponent as EmpresasComponent } from './vistas/corp/empresas/listar/listar.component';
import { ListarComponent as UsuariosCorpComponent } from './vistas/corp/usuarios/listar/listar.component';
import { ListarComponent as RolesCorpComponent } from './vistas/corp/roles/listar/listar.component';
import { ListarComponent as UsuariosCenterComponent } from './vistas/center/usuarios/listar/listar.component';
import { ListarComponent as RolesCenterComponent } from './vistas/center/roles/listar/listar.component';
import { ListarComponent as ParametrizacionesCenterComponent } from './vistas/center/parametrizaciones/listar/listar.component';
import { ListarComponent as ProductosCenterComponent } from './vistas/center/productos/listar/listar.component';
import { ListarComponent as CargarSuperMonedasCorpComponent } from './vistas/corp/cargarSuperMonedas/listar/listar.component';
import { SolicitudesCreditosComponent } from './vistas/center/solicitudes-creditos/solicitudes-creditos.component';
import { ListarComponent as PublicacionesListar} from './vistas/center/publicaciones/listar/listar.component';
import { UploadComponent } from './vistas/corp/cargarCreditosEmpleados/vistas/upload/upload.component';
import { ListarComponent as ProductosBienvenidaListar } from './vistas/center/productos-bienvenida-sm/listar/listar.component';
import { ListarComponent as ProductosMensajeListar } from './vistas/center/productos-mensaje-sm/listar/listar.component';
import { ListarComponent as ProductosNuestraFamiliaListar } from './vistas/center/productos-nuestra-familia-sm/listar/listar.component';
import { ListarComponent as CorreosLandingListar } from './vistas/center/Correos-landing/listar/listar.component';
import { ConsumoCreditosComponent } from './vistas/center/consumo-creditos/consumo-creditos.component';
import { EmpleadosComponent } from './vistas/center/solicitudes-creditos/empleados/empleados.component';
import { RevisionDocumentosComponent } from './vistas/center/solicitudes-creditos/revision-documentos/revision-documentos.component';
import { NegocioPropioComponent } from './vistas/center/solicitudes-creditos/negocio-propio/negocio-propio.component';
import { ValoresProcesoComponent } from './vistas/center/solicitudes-creditos/valores-proceso/valores-proceso.component';
import { ResumenComponent } from './vistas/center/solicitudes-creditos/resumen/resumen.component';
import { NegocioPropioPreaprovaodsComponent } from './vistas/center/solicitudes-creditos/negocio-propio-preaprovaods/negocio-propio-preaprovaods.component';
import { EmpleadosPreaprovaodsComponent } from './vistas/center/solicitudes-creditos/empleados-preaprovaods/empleados-preaprovaods.component';
import { MicrocreditosPreAprovadosComponent } from './vistas/center/solicitudes-creditos/microcreditos-pre-aprovados/microcreditos-pre-aprovados.component';
import { MicrocreditosNormalesComponent } from './vistas/center/solicitudes-creditos/microcreditos-normales/microcreditos-normales.component';
import { SolicitudesPagoProveedoresComponent } from './vistas/center/solicitudes-pago-proveedores/solicitudes-pago-proveedores.component';
import { SolicitudesPagoCasasComercialComponent } from './vistas/center/solicitudes-pago-casas-comercial/solicitudes-pago-casas-comercial.component';
import { EmpleadosComponent as EmpleadosCorp } from './vistas/corp/empleados/empleados/empleados.component';

const routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: PrincipalComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'corp', children: [
      {
        path: '', redirectTo: 'cargar_empleados', pathMatch: 'full'
      },
      {
        path: 'cargar_empleados', component: EmpleadosCorp, canActivate: [AuthGuard]
      },
      {
        path: 'usuarios', component: UsuariosCorpComponent, canActivate: [AuthGuard]
      },
      {
        path: 'roles', component: RolesCorpComponent, canActivate: [AuthGuard]
      },
      {
        path: 'cargarBig-Puntos', component: CargarSuperMonedasCorpComponent, canActivate: [AuthGuard]
      },
      {
        path: 'cargarCreditosEmpleados', component: UploadComponent, canActivate: [AuthGuard]
      },
    ],
  },
  {
    path: 'center', children: [
      {
        path: '', redirectTo: 'usuarios', pathMatch: 'full'
      },
      {
        path: 'usuarios', component: UsuariosCenterComponent, canActivate: [AuthGuard]
      },
      {
        path: 'roles', component: RolesCenterComponent, canActivate: [AuthGuard]
      },
      {
        path: 'parametrizaciones', component: ParametrizacionesCenterComponent, canActivate: [AuthGuard]
      },
      {
        path: 'productos', component: ProductosCenterComponent, canActivate: [AuthGuard]
      },
      {
        path: 'productos-bienvenido-sm', component: ProductosBienvenidaListar, canActivate: [AuthGuard]
      },
      {
        path: 'productos-mensaje-sm', component: ProductosMensajeListar, canActivate: [AuthGuard]
      },
      {
        path: 'productos-nuestra-familia-sm', component: ProductosNuestraFamiliaListar, canActivate: [AuthGuard]
      },
      {
        path: 'reporte-correos-landing', component: CorreosLandingListar, canActivate: [AuthGuard]
      },
      {
        path: 'solicitudes-creditos',
        children: [
          {path: '', redirectTo: 'empleados', pathMatch: 'full'},
          {
            path: 'empleados',
            component: EmpleadosComponent,
            // data: {roles: [Role.BigPuntos]},
            canActivate: [AuthGuard]
          },
          {
            path: 'negocios',
            component: NegocioPropioComponent,
            // data: {roles: [Role.BigPuntos]},
            canActivate: [AuthGuard]
          },
          {
            path: 'negocios-propios-pre-aprobados',
            component: NegocioPropioPreaprovaodsComponent,
            // data: {roles: [Role.BigPuntos]},
            canActivate: [AuthGuard]
          },
          {
            path: 'empelados-pre-aprobados',
            component: EmpleadosPreaprovaodsComponent,
            // data: {roles: [Role.BigPuntos]},
            canActivate: [AuthGuard]
          },
          {
            path: 'microcreditPreAprovado',
            component: MicrocreditosPreAprovadosComponent,
            // data: {roles: [Role.BigPuntos]},
            canActivate: [AuthGuard]
          },
          {
            path: 'microcreditNormales',
            component: MicrocreditosNormalesComponent,
            // data: {roles: [Role.BigPuntos]},
            canActivate: [AuthGuard]
          },
        ]
      },
      {
        path: 'solicitud-pago-proveedores', component: SolicitudesPagoProveedoresComponent, canActivate: [AuthGuard]
      },
      {
        path: 'solicitud-pago-casas-comerciales', component: SolicitudesPagoCasasComercialComponent, canActivate: [AuthGuard]
      },
      {
        path: 'consumosCreditos', component: ConsumoCreditosComponent, canActivate: [AuthGuard]
      },
      {
        path: 'publicaciones', component: PublicacionesListar, canActivate: [AuthGuard]
      },
    ]
  }


];

@NgModule({
  declarations: [
    PrincipalComponent,
    PerfilUsuarioComponent,
    EmpresasComponent,
    UsuariosCorpComponent,
    RolesCorpComponent,
    UsuariosCenterComponent,
    RolesCenterComponent,
    ParametrizacionesCenterComponent,
    ProductosCenterComponent,
    CargarSuperMonedasCorpComponent,
    SolicitudesCreditosComponent,
    PublicacionesListar,
    UploadComponent,
    ProductosBienvenidaListar,
    ProductosMensajeListar,
    ProductosNuestraFamiliaListar,
    CorreosLandingListar,
    ConsumoCreditosComponent,
    EmpleadosComponent,
    RevisionDocumentosComponent,
    NegocioPropioComponent,
    ValoresProcesoComponent,
    ResumenComponent,
    NegocioPropioPreaprovaodsComponent,
    EmpleadosPreaprovaodsComponent,
    MicrocreditosPreAprovadosComponent,
    MicrocreditosNormalesComponent,
    SolicitudesPagoProveedoresComponent,
    SolicitudesPagoCasasComercialComponent,
    EmpleadosCorp,
  ],
  imports: [
    CoreCommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    TranslateModule,
    SwiperModule,
    FormsModule,
    CoreTouchspinModule,
    CoreSidebarModule,
    NgbModule,
    Ng2FlatpickrModule,
    CardSnippetModule,
    ShareIconsModule,
    ShareButtonsModule,
    QRCodeModule,
    FlatpickrModule.forRoot()
  ],
  exports: [

    PrincipalComponent,
    PerfilUsuarioComponent,
    EmpresasComponent,
    UsuariosCorpComponent,
    RolesCorpComponent,
    UsuariosCenterComponent,
    RolesCenterComponent,
    ParametrizacionesCenterComponent,
    ProductosCenterComponent,
    CargarSuperMonedasCorpComponent,
    PublicacionesListar,
    UploadComponent,
    ProductosBienvenidaListar,
    ProductosMensajeListar,
    ProductosNuestraFamiliaListar,
    CorreosLandingListar,
  ]
})
export class CentralModule { }
