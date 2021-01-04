import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { IMenuRepository } from 'src/app/core/repository/menu.repository';
import { IPerfilRepository } from 'src/app/core/repository/perfil.repository';
import { CheckTreeViewComponent, ITree } from 'src/app/modules/shared/check-tree-view/check-tree-view.component';
import { UtilsService } from 'src/app/utils/utils';

@Component({
  selector: 'app-perfil-modal',
  templateUrl: './perfil-modal.component.html',
  styleUrls: ['./perfil-modal.component.css']
})
export class PerfilModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private perfilRepository: IPerfilRepository,
    private menuRepository: IMenuRepository,
    public utilsService: UtilsService,
  ) { }

  @ViewChild(CheckTreeViewComponent) child: CheckTreeViewComponent;

  tipoFormulario: number;
  perfilId: number;
  perfilInitialState: any = {
    nombre: '',
    tipoPerfil: null,
    activo: true,
  };

  perfilForm: FormGroup;
  tiposPerfiles = [];
  opcionesElegidas = [];
  menu: ITree[] = [];
  menuInitialState: ITree[] = [];
  menuPrincipal: any;
 
  @Output() successed = new EventEmitter();
  
  ngOnInit(): void {
    this.inicializar();
  }

  async inicializar() {
    this.inicializarForm();
    this.tiposPerfiles = await this.perfilRepository.listarTipoPerfilItem().toPromise();
    if (this.tipoFormulario == 2) {
      this.inicializarData();
    }

  }

  inicializarData(): void {
    this.perfilRepository.listarDetallePerfil(this.perfilId).subscribe(async data => {
      this.perfilInitialState = {
        nombre: data.nombre,
        tipoPerfil: this.tiposPerfiles.find(tipoPerfil => tipoPerfil.id == data.tipoPerfilId),
        activo: data.activo,
      }
      this.inicializarForm();
      this.menuPrincipal = data.tree.find(menu => menu.home);
      this.menu = data.tree.filter(menu => !menu.home);        
      this.menuInitialState = this.utilsService.copy(this.menu);
      setTimeout(()=> this.child.actualizarDataSource(), 0);
      

      
    });
  }

  inicializarForm(): void {
    this.perfilForm = new FormGroup({
      'nombre': new FormControl(this.perfilInitialState.nombre, Validators.required),
      'tipoPerfil': new FormControl(this.perfilInitialState.tipoPerfil, Validators.required),
      'activo': new FormControl(this.perfilInitialState.activo, Validators.required),
    }, this.formValidator.bind(this));
  }

  onTipoPerfilSelectedChanged(tipoPerfil) {
    if (tipoPerfil != null) {
      this.menuRepository.listarMenuPorTipoPerfil(tipoPerfil.id).pipe(take(1)).subscribe(data => {
        this.menuPrincipal = data.find(menu => menu.home);
        this.menu = data.filter(menu => !menu.home);        
        this.menuInitialState = this.utilsService.copy(this.menu);
        this.child.actualizarDataSource();
      });
    }    
  }



  submit(value) {
    let opcionesSeleccionadas = this.listarOpcionesSeleccionadas(this.menu);
    opcionesSeleccionadas.push(this.menuPrincipal.id);
    let registro = {
      nombre: value.nombre, 
      tipoPerfilId: value.tipoPerfil.id,
      activo: value.activo,
      opcionesIds: opcionesSeleccionadas,
    }
    if (this.tipoFormulario == 1) this.registrarPerfil(registro);
    else this.actualizarPerfil(this.perfilId, registro);
  }

  cerrar() {
    this.bsModalRef.hide();
  }


  private formValidator(form: FormGroup): ValidationErrors | null {

    if (!this.algunNodoSeleccionado(this.menu)) {
      return {
        ningunSeleccionado: true,
      }
    }

    if (this.utilsService.deepEqual(this.perfilInitialState, form.value) &&
      this.utilsService.deepEqual(this.menu, this.menuInitialState)) {
      return {
        sinCambios: true,
      }
    }

    return null;
  }

  public onCheckedChanged(): void {
    setTimeout(() => this.perfilForm.updateValueAndValidity(), 0);
  }

  private algunNodoSeleccionado(trees: ITree[]): boolean {
    for (let i = 0; i < trees.length; i++) {
      const element = trees[i];
      if (element.checked) {
        return true;
      } else {
        if (element.children && element.children.length > 0) {
          var s = this.algunNodoSeleccionado(element.children);
          if (s) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private listarOpcionesSeleccionadas(trees: ITree[]): number[] {
    let seleccionadas = [];
    for (let i = 0; i < trees.length; i++) {
      const element = trees[i];
      if (element.children && element.children.length > 0) {
        seleccionadas = seleccionadas.concat(this.listarOpcionesSeleccionadas(element.children));
      }else{
        if (element.checked) {
          seleccionadas.push(element.id);
        }
      }
    }
    return seleccionadas;
  }

  private registrarPerfil(registro: any): void{
    this.perfilRepository.registrarPerfil(registro).pipe(take(1)).subscribe(
      data => {
        if (data.status == "success") {
          this.successed.emit();
          this.bsModalRef.hide();
          this.notifier.notify("success", "Se ha registrado el perfil correctamente");
        }else{
          this.notifier.notify(data.status == "fail" ? "warning": "error", data.message);
        }
      }
    )
  }

  private actualizarPerfil(perfilId: number, registro: any): void{
    this.perfilRepository.actualizarPerfil(perfilId, registro).pipe(take(1)).subscribe(
      data => {
        if (data.status == "success") {
          this.successed.emit();
          this.bsModalRef.hide();
          this.notifier.notify("success", "Se ha actualizado el perfil correctamente");
        }else{
          this.notifier.notify(data.status == "fail" ? "warning": "error", data.message);
        }
      }
    )
  }

}
