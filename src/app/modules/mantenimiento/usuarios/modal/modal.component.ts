import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { take } from 'rxjs/operators';
import { IPerfilRepository } from 'src/app/core/repository/perfil.repository';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public areaRepository: IAreaRepository,
    public usuarioRepository: IUsuarioRepository,
    public perfilRepository: IPerfilRepository,
    public utdRepository: IUtdRepository, private modalService: BsModalService,
    private notifier: NotifierService) { }
  tipoFormulario: number;
  usuarioFormInitialState: any = {
    nombre: '',
    username: '',
    correo: '',
    contrasena: '',
    tipoPerfil: null,
    perfil: null,
    area: null,
    activo: true,
  };
  show_password: boolean;

  usuarioId: number;
  usuarioForm: FormGroup;
  mostrar: any;
  tiposPerfil: any[] = [];
  perfiles: any[] = [];
  areas: any[] = [];
  utds: any[] = [];
  utdsSeleccionadas: any[] = [];
  utdsSeleccionadasInitialState: any[] = [];
  utd: any;
  showAreaOrUtd: boolean = true;
  ngOnInit(): void {
    this.show_password = false;
    this.inicializarForm();
    if (this.tipoFormulario == 2) {
      this.listarDetalleUsuario();
    }
    this.inicializar();
  }

  inicializarForm(): void {
    this.usuarioForm = new FormGroup({
      nombre: new FormControl(this.usuarioFormInitialState.nombre, Validators.required),
      username: new FormControl(this.usuarioFormInitialState.username, Validators.required),
      correo: new FormControl(this.usuarioFormInitialState.correo, [
        Validators.required,
        Validators.email
      ]),
      contrasena: new FormControl(this.usuarioFormInitialState.contrasena, this.tipoFormulario == 1 ? Validators.required : null),
      tipoPerfil: new FormControl(this.usuarioFormInitialState.tipoPerfil, Validators.required),
      perfil: new FormControl(this.usuarioFormInitialState.perfil, Validators.required),
      activo: new FormControl(this.usuarioFormInitialState.activo, Validators.required),
      area: new FormControl(this.usuarioFormInitialState.area),
    }, this.formValidator.bind(this));
  }


  async inicializar() {
/*     this.perfiles = await this.listarPerfiles();
 */    this.tiposPerfil = await this.listarTiposPerfil();
    this.utds = await this.listarUtds();
    this.areas = await this.listarAreas();
    if (this.tipoFormulario == 2) {
      var dataRespuesta = await this.listarDetalleUsuario();
      var data = dataRespuesta.data;
      this.usuarioFormInitialState = {
        nombre: data.nombre,
        username: data.username,
        correo: data.correo,
        contrasena: data.password,
        perfil: data.perfil,
        tipoPerfil: data.perfil.tipoPerfil,
        area: data.area != null ? this.areas.find(area => area.id == data.area.id) : null,
        activo: data.estado
      }
      if (data.perfil.tipoPerfil.id == 1) {
        this.showAreaOrUtd = true;
      } else {
        this.showAreaOrUtd = false;
      }
      this.perfiles = await this.listarPerfiles(data.perfil.tipoPerfil.id);
      this.utdsSeleccionadas = data.utds != null ? this.utds.filter(utd => data.utds.findIndex(utd2 => utd2.id == utd.id) > -1) : [];
      this.utdsSeleccionadasInitialState = [...this.utdsSeleccionadas];
      this.inicializarForm();
    }
  }

  showPassword() {
    this.show_password = !this.show_password;
  }

  listarUtds() {
    return this.utdRepository.listarUtdsActivos().pipe(take(1)).toPromise();
  }

  listarPerfiles(tipoPerfilId: any) {
    return this.perfilRepository.listarPerfilByTipoPerfilId(tipoPerfilId).pipe(take(1)).toPromise();
  }

  async onTipoUsuarioSelectedChanged(tipoPerfil: any) {
    if (tipoPerfil.id == 1) {
      this.showAreaOrUtd = true;
    } else {
      this.showAreaOrUtd = false;
    }
    this.perfiles = await this.listarPerfiles(tipoPerfil.id);
    this.usuarioForm.updateValueAndValidity();
  }

  listarAreas() {
    return this.areaRepository.listarAreasItem().pipe(take(1)).toPromise();
  }

  listarTiposPerfil() {
    return this.perfilRepository.listarTipoPerfilItem().pipe(take(1)).toPromise();
  }

  listarDetalleUsuario() {
    return this.usuarioRepository.listarDetalleUsuario(this.usuarioId).pipe(take(1)).toPromise();
  }



  private formValidator(form: FormGroup): ValidationErrors | null {
    if (this.showAreaOrUtd == true) {
      if (this.utdsSeleccionadas.length == 0) {
        return {
          noUtds: true
        }
      }
      if (JSON.stringify(this.usuarioFormInitialState) == JSON.stringify(this.usuarioForm.value)) {
        return {
          noCambio: true
        }
      }
    } else {
      this.mostrar = this.usuarioForm.get("tipoPerfil").value;
      if (this.mostrar != null) {
        if (this.mostrar.id == 2) {
          if (this.usuarioForm.get("area").value == null) {
            return {
              noArea: true
            }
          }
        }
      }
    }
    return null;
  }

  removerUtd(utd: any) {
    this.utdsSeleccionadas.splice(this.utdsSeleccionadas.findIndex(utdSeleccionada => utdSeleccionada == utd), 1);
    this.usuarioForm.updateValueAndValidity();
  }

  cerrar() {
    this.bsModalRef.hide();
  }

  agregarUtd(utd: any) {
    if (utd) {
      if (this.utdsSeleccionadas.findIndex(utdsSeleccionadas => utdsSeleccionadas == utd) == -1) {
        this.utdsSeleccionadas.push(utd);
        this.usuarioForm.updateValueAndValidity();
      } else {
        alert('No puedes agregar un área que ya está en la lista');
      }
    }
    this.utd = null;
  }


  submit(value: any) {
    value.utds = this.utdsSeleccionadas;
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: this.tipoFormulario == 1 ? "¿Está seguro que desea crear?" : "¿Está seguro que desea modificar?"
      }
    });

    bsModalRef.content.confirmarEvent.subscribe(() => {
      if (this.tipoFormulario == 1) {
        this.usuarioRepository.registrarUsuario(value).pipe(take(1)).subscribe(data => {
          if (data.status == "success") {
            this.notifier.notify('success', 'Usuario creado');
            this.bsModalRef.hide();
          } else {
            this.notifier.notify('error', 'No se creó el usuario');
          }
        },
          error => {
            this.notifier.notify('error', 'No se creó el usuario');
          });
      } else {
        this.usuarioRepository.editarUsuario(this.usuarioId, value).pipe(take(1)).subscribe(data => {
          if (data.status == "success") {
            this.notifier.notify('success', 'Usuario actualizado');
            this.bsModalRef.hide();
          } else {
            this.notifier.notify('error', 'No se actualizó el usuario');
          }
        },  
          error => {
            this.notifier.notify('error', 'No se actualizó el usuario');
          });
      }
    })
  }

}