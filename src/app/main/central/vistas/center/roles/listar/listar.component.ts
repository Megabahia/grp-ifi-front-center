import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Rol } from '../models/rol';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RolesService } from '../roles.service';
import { DatePipe } from '@angular/common';
import { CoreSidebarService } from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [DatePipe]

})
export class ListarComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('mensajeModal') mensajeModal;
  @ViewChild('eliminarRolMdl') eliminarRolMdl;
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public listaRoles;
  public rol: Rol;
  private _unsubscribeAll: Subject<any>;
  private idRol;
  public ruc;
  public rolesForm: FormGroup;
  public rolSubmitted: boolean;
  public mensaje = "";
  public cargandoRol = false;

  constructor(
    private datePipe: DatePipe,
    private _coreSidebarService: CoreSidebarService,
    private _rolService: RolesService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {
    this._unsubscribeAll = new Subject();
    this.idRol = "";
    this.rol = {
      id: "",
      codigo: "",
      config: "",
      descripcion: "",
      nombre: ""
    }
  }

  ngOnInit(): void {
    this.rolesForm = this._formBuilder.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
    });
  }
  ngAfterViewInit() {
    this.iniciarPaginador();

    this.obtenerListaRoles();
  }
  obtenerListaRoles() {
    this._rolService.obtenerListaRoles({
      page: this.page - 1, page_size: this.page_size, tipoUsuario: "center"
    }).subscribe(info => {
      this.listaRoles = info.info;
      this.collectionSize = info.cont;
    });
  }
  toggleSidebar(name, id): void {
    this.idRol = id;
    if (this.idRol) {
      this._rolService.obtenerRol(this.idRol).subscribe((info) => {
        this.rol = info.rol;
      },
        (error) => {
          this.mensaje = "No se ha podido obtener el rol";

          this.abrirModal(this.mensajeModal);
        });
    } else {
      this.rol = {
        id: "",
        codigo: "",
        config: "",
        descripcion: "",
        nombre: ""
      }
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  guardarRol() {
    this.rolSubmitted = true;
    if (this.rolesForm.invalid) {
      return;
    }
    this.cargandoRol = true;

    if (this.idRol == "") {
      this._rolService.crearRol({ ...this.rol, tipoUsuario: 'center' }).subscribe((info) => {
        this.obtenerListaRoles();
        this.mensaje = "Rol guardado con éxito";
        this.abrirModal(this.mensajeModal);
        this.toggleSidebar('guardarRol', '');
        this.cargandoRol = false;

      },
        (error) => {
          // console.log(error);
          // let errores = Object.values(error);
          // let llaves = Object.keys(error);
          this.mensaje = "Error en el guardado";
          // errores.map((infoErrores, index) => {
          //   this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          // });
          this.abrirModal(this.mensajeModal);
          this.cargandoRol = false;

        });
    } else {
      this._rolService.actualizarRol(this.rol).subscribe((info) => {
        this.obtenerListaRoles();
        this.mensaje = "Rol actualizado con éxito";
        this.abrirModal(this.mensajeModal);
        this.toggleSidebar('guardarRol', '');
        this.cargandoRol = false;

      },
        (error) => {
          this.mensaje = "Error actualizando el rol";
          this.abrirModal(this.mensajeModal);
          this.cargandoRol = false;

        });
    }

  }
  eliminarRol() {
    this._rolService.eliminarRol(this.idRol).subscribe(() => {
      this.obtenerListaRoles();
      this.mensaje = "Rol eliminado correctamente";
      this.abrirModal(this.mensajeModal);
    },
      (error) => {
        this.mensaje = "Ha ocurrido un error al eliminar el rol";
        this.abrirModal(this.mensajeModal);
      });
  }
  get rolForm() {
    return this.rolesForm.controls;
  }
  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaRoles();
    });
  }
  eliminarRolModal(id) {
    this.idRol = id;
    this.abrirModal(this.eliminarRolMdl);
  }
  abrirModal(modal) {
    this._modalService.open(modal)
  }
  cerrarModal() {
    this._modalService.dismissAll();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
