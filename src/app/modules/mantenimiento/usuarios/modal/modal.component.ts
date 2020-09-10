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
import { UtilsService } from 'src/app/utils/utils';

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
    private notifier: NotifierService,
    private utils: UtilsService) { }
  tipoFormulario: number;
  usuarioFormInitialState: any = {
    codigo: '',
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
  tipoPerfil: any;
  tiposPerfil: any[] = [];
  perfiles: any[] = [];
  areas: any[] = [];
  utds: any[] = [];
  utdsSeleccionadas: any[] = [];
  utdsSeleccionadasInitialState: any[] = [];
  utd: any;
  showUTD: boolean = true;
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
      codigo: new FormControl(this.usuarioFormInitialState.codigo, Validators.required),
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
        codigo: data.codigo,
        nombre: data.nombre,
        username: data.username,
        correo: data.correo,
        contrasena: '',
        perfil: data.perfil,
        tipoPerfil: data.perfil.tipoPerfil,
        area: data.area != null ? this.areas.find(area => area.id == data.area.id) : null,
        activo: data.estado
      }
      if (data.perfil.tipoPerfil.id == 1) {
        this.showUTD = true;
      } else {
        this.showUTD = false;
      }
      this.perfiles = await this.listarPerfiles(data.perfil.tipoPerfil.id);
      this.utdsSeleccionadas = data.utds ? data.utds.map(utd => {
        return {
          seleccionado: utd.principal,
          data: utd
        }
      }) : [];
      this.utdsSeleccionadasInitialState = this.utils.copy(this.utdsSeleccionadas);
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
      this.showUTD = true;
    } else {
      this.showUTD = false;
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
    if (this.showUTD == true) {
      if (this.utdsSeleccionadas.length == 0) {
        return {
          noUtds: true
        }
      }
      if (this.utdsSeleccionadas.findIndex(wrapper => wrapper.data.principal) < 0) {
        return {
          noPrincipal: true
        }
      }
    } else {
      this.tipoPerfil = this.usuarioForm.get("tipoPerfil").value;
      if (this.tipoPerfil != null && this.tipoPerfil.id == 2 && this.usuarioForm.get("area").value == null) {
        return {
          noArea: true
        }
      }
    }

    if (this.utils.deepEqual(this.usuarioFormInitialState, this.usuarioForm.value) && (!this.showUTD || this.utils.deepEqual(this.utdsSeleccionadas, this.utdsSeleccionadasInitialState))) {
      return {
        noCambio: true
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
      if (this.utdsSeleccionadas.findIndex(utdSeleccionada => utdSeleccionada.data.id == utd.id) == -1) {
        this.utdsSeleccionadas.push({
          seleccionado: false,
          data: {
            id: utd.id,
            nombre: utd.descripcion,
          },
          principal: false,
        });
        this.usuarioForm.updateValueAndValidity();
      } else {
        this.notifier.notify('warning', 'No puedes agregar una UTD que ya está en la lista');
      }
    }
    this.utd = null;
  }


  toggleSeleccionar(wrapper): void {
    if (!wrapper.seleccionado) {
      this.utdsSeleccionadas.forEach(utd => {
        utd.seleccionado = false;
        utd.data.principal = false;
      });
      wrapper.seleccionado = true;
      wrapper.data.principal = true;

    } else {
      wrapper.seleccionado = false;
      wrapper.data.principal = false;
    }
    this.usuarioForm.updateValueAndValidity();
  }

  submit(value: any) {
    value.utds = this.utdsSeleccionadas.map(wrapper => wrapper.data);
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
