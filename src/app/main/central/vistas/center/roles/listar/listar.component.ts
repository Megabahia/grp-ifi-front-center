import {AfterViewInit, Component, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbPagination, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, Subject} from 'rxjs';
import {Rol} from '../models/rol';
import {FormGroup, FormBuilder, Validators, FormArray, FormControl} from '@angular/forms';
import {RolesService} from '../roles.service';
import {DatePipe} from '@angular/common';
import {CoreSidebarService} from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {menu} from '../../../../../../menu/menu';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';

const TREE_DATA: any[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: any, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as any);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: any, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * IFIS
 * Center
 * Esta pantalla sirve para listar los roles
 * Rutas:
 * `${environment.apiUrl}/central/roles/list/`,
 * `${environment.apiUrl}/central/roles/listOne/${id}`
 * `${environment.apiUrl}/central/roles/create/`,
 * `${environment.apiUrl}/central/roles/update/${datos._id}`,
 * `${environment.apiUrl}/central/roles/delete/${id}`
 */


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [DatePipe]

})
export class ListarComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public mensaje = '';
  public cargandoRol = false;

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.url,
      title: node.title,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: any) => node.expandable;

  checklistSelection = new SelectionModel<any>(true /* multiple */);

  todoLeafItemSelectionToggle(node: any): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: any): void {
    let parent: any | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: any): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        // this.onCheckboxChange(child);
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: any): any | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getLevel = (node: any) => node.level;

  constructor(
    private datePipe: DatePipe,
    private _coreSidebarService: CoreSidebarService,
    private _rolService: RolesService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {
    this._unsubscribeAll = new Subject();
    this.idRol = '';
    this.rol = {
      id: '',
      codigo: '',
      config: '',
      descripcion: '',
      nombre: ''
    };
    this.dataSource.data = menu;
  }

  onCheckboxChange(event: any) {
    const selectedCountries = (this.rolesForm.controls['config'] as FormArray);
    if (event.target.checked) {
      selectedCountries.push(new FormControl(event.target.value));
    } else {
      const index = selectedCountries.controls
        .findIndex(x => x.value === event.target.value);
      selectedCountries.removeAt(index);
    }
  }

  descendantsAllSelected(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: any, event?): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  descendantsPartiallySelected(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  ngOnInit(): void {
    this.rolesForm = this._formBuilder.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      config: new FormArray([])
    });
  }

  ngAfterViewInit() {
    this.iniciarPaginador();

    this.obtenerListaRoles();
  }

  obtenerListaRoles() {
    this._rolService.obtenerListaRoles({
      page: this.page - 1, page_size: this.page_size, tipoUsuario: 'center'
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
          this.mensaje = 'No se ha podido obtener el rol';

          this.abrirModal(this.mensajeModal);
        });
    } else {
      this.rol = {
        id: '',
        codigo: '',
        config: '',
        descripcion: '',
        nombre: ''
      };
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  guardarRol() {
    const values = this.checklistSelection.selected;
    this.rol.config = JSON.stringify(values.reduce((acumulador, item) => {
      if (item && item.name !== undefined) {
        return [...acumulador, item.name];
      }
      return acumulador;
    }, []));
    this.rolSubmitted = true;
    if (this.rolesForm.invalid) {
      return;
    }
    this.cargandoRol = true;

    if (this.idRol === '') {
      this._rolService.crearRol({...this.rol, tipoUsuario: 'center'}).subscribe((info) => {
          this.obtenerListaRoles();
          this.mensaje = 'Rol guardado con éxito';
          this.abrirModal(this.mensajeModal);
          this.toggleSidebar('guardarRol', '');
          this.cargandoRol = false;

        },
        (error) => {
          // console.log(error);
          // let errores = Object.values(error);
          // let llaves = Object.keys(error);
          this.mensaje = 'Error en el guardado';
          // errores.map((infoErrores, index) => {
          //   this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          // });
          this.abrirModal(this.mensajeModal);
          this.cargandoRol = false;

        });
    } else {
      this._rolService.actualizarRol(this.rol).subscribe((info) => {
          this.obtenerListaRoles();
          this.mensaje = 'Rol actualizado con éxito';
          this.abrirModal(this.mensajeModal);
          this.toggleSidebar('guardarRol', '');
          this.cargandoRol = false;

        },
        (error) => {
          this.mensaje = 'Error actualizando el rol';
          this.abrirModal(this.mensajeModal);
          this.cargandoRol = false;

        });
    }

  }

  eliminarRol() {
    this._rolService.eliminarRol(this.idRol).subscribe(() => {
        this.obtenerListaRoles();
        this.mensaje = 'Rol eliminado correctamente';
        this.abrirModal(this.mensajeModal);
      },
      (error) => {
        this.mensaje = 'Ha ocurrido un error al eliminar el rol';
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
    this._modalService.open(modal);
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
