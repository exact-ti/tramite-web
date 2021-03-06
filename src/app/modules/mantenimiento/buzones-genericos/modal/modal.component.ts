import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { take } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from 'src/app/utils/utils';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef,
    public areaRepository: IAreaRepository,
    public usuarioRepository: IUsuarioRepository,
    public buzonRepository: IBuzonRepository, private modalService: BsModalService, private notifier: NotifierService, 
    private utilsService: UtilsService,
  ) { }

  tipoFormulario: number;
  buzonFormInitialState: any = {
    nombre: '',
    area: null,
    activo: true,
  };

  @Output() successed = new EventEmitter();

  buzonGenericoId: number;
  buzonForm: FormGroup;
  mostrar: any;
  areas: any[] = [];
  usuarios: any[] = [];
  usuariosSeleccionadas: any[] = [];
  usuariosSeleccionadasInitialState: any[] = [];
  representanteSeleccionado = false;
  usuario: any;

  ngOnInit(): void {
    this.inicializarForm();
    if (this.tipoFormulario == 2) {
      this.listarDetalleBuzon();
    }
    this.inicializar();
  }

  inicializarForm(): void {
    this.buzonForm = new FormGroup({
      nombre: new FormControl(this.buzonFormInitialState.nombre, Validators.required),
      activo: new FormControl(this.buzonFormInitialState.activo, Validators.required),
      area: new FormControl(this.buzonFormInitialState.area, Validators.required),
    }, this.formValidator.bind(this));
  }


  async inicializar() {
    this.areas = await this.listarAreas();
    var dataRespuestaUsuario = await this.listarUsuarios();
    this.usuarios = dataRespuestaUsuario.data;
    if (this.tipoFormulario == 2) {
      var dataRespuesta = await this.listarDetalleBuzon();
      var data = dataRespuesta.data;
      this.buzonFormInitialState = {
        nombre: data.nombre,
        area: data.area != null ? this.areas.find(area => area.id == data.area.id) : null,
        activo: data.activo
      }

      this.usuariosSeleccionadas = data.usuarios != null ? data.usuarios.map(usuarioBuzon => {
        return {
          seleccionado: usuarioBuzon.representante,
          data: usuarioBuzon
        }
      }) : [];
      this.representanteSeleccionado = true;
      this.usuariosSeleccionadasInitialState = this.utilsService.copy(this.usuariosSeleccionadas);
      this.inicializarForm();
    }
  }


  listarAreas() {
    return this.areaRepository.listarAreasDeUTD(true).pipe(take(1)).toPromise();
  }

  seleccionarToggle(wrapper: any){
    if (!wrapper.seleccionado) {
      this.usuariosSeleccionadas.forEach(usuario => {
        usuario.seleccionado = false;
        usuario.data.representante = false;
      });
      wrapper.seleccionado = true;
      wrapper.data.representante = true;
      this.representanteSeleccionado = true;

    } else {
      wrapper.seleccionado = false;
      wrapper.data.representante = false;
      this.representanteSeleccionado = false;
    }
    this.buzonForm.updateValueAndValidity();
  }


  listarDetalleBuzon() {
    return this.buzonRepository.listarDetalleBuzon(this.buzonGenericoId).pipe(take(1)).toPromise();
  }

  listarUsuarios() {
    return this.usuarioRepository.listarUsuariosConBuzon().pipe(take(1)).toPromise();
  }

  private formValidator(form: FormGroup): ValidationErrors | null {
    if(this.usuariosSeleccionadas.length > 0 && this.usuariosSeleccionadas.findIndex(usuario => usuario.data.representante) == -1){
      return {
        noRepresentante: true
      }
    }
    if (this.buzonForm) {
      if (this.buzonFormInitialState.nombre == this.buzonForm.value.nombre) {
        if (this.buzonFormInitialState.activo == this.buzonForm.value.activo) {
          if (this.buzonForm.value.area != null) {
            var areaInitial = this.buzonFormInitialState.area;
            var areaForm = this.buzonForm.value.area;
            if (areaInitial.id == areaForm.id) {
              if (JSON.stringify(this.usuariosSeleccionadasInitialState) == JSON.stringify(this.usuariosSeleccionadas)) {
                return {
                  noCambio: true
                }
              }
            }
          }
        }
      }
      /*          if (JSON.stringify(this.buzonFormInitialState) == JSON.stringify(this.buzonForm.value)) {
                 if (JSON.stringify(this.usuariosSeleccionadasInitialState) == JSON.stringify(this.usuariosSeleccionadas)) {
                   return {
                     noCambio: true
                   }
                 } 
               } */
    } else {
      return {
        noDefinido: true
      }
    }


    return null;
  }

  removerUsuario(usuario: any) {
    this.usuariosSeleccionadas.splice(this.usuariosSeleccionadas.findIndex(usuarioSeleccionada => usuarioSeleccionada.data.id == usuario.id), 1);
    if(this.usuariosSeleccionadas.findIndex(usuarioSeleccionada => usuarioSeleccionada.data.representante) == -1){
      this.representanteSeleccionado == false;
    }
    this.buzonForm.updateValueAndValidity();
  }

  cerrar() {
    this.bsModalRef.hide();
  }

  agregarUsuario(usuario: any) {
    if (usuario) {
      if (this.usuariosSeleccionadas.findIndex(usuarioSeleccionado => usuarioSeleccionado.data.id == usuario.id) == -1) {
        this.usuariosSeleccionadas.push({
          seleccionado: false,
          data: usuario,
        });
        this.buzonForm.updateValueAndValidity();
      } else {
        this.notifier.notify('warning','No puedes agregar un usuario que ya está en la lista');
      }
    }
    this.usuario = null;
  }


  submit(value: any) {
    value.usuarios = this.usuariosSeleccionadas.map(usuarioSeleccionado => usuarioSeleccionado.data);
    value.representante = this.usuariosSeleccionadas.find(usuarioSeleccionado => usuarioSeleccionado.data.representante)?.data;
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: this.tipoFormulario == 1 ? "¿Está seguro que desea crear un nuevo buzón?" : "¿Está seguro que desea modificar el buzón?"
      }
    });

    bsModalRef.content.confirmarEvent.subscribe(() => {
      if (this.tipoFormulario == 1) {
        this.buzonRepository.registrarBuzon(value).pipe(take(1)).subscribe(data => {
          if (data.status == "success") {
            this.notifier.notify('success', 'Se ha creado el buzón correctamente');
            this.successed.emit();
            this.bsModalRef.hide();
          }else{
            this.notifier.notify('error', 'No se registro el buzón');
          }
        },
        error => {
          this.notifier.notify('error', 'No se registro el buzón');
        });
      } else {
        this.buzonRepository.editarBuzon(this.buzonGenericoId, value).pipe(take(1)).subscribe(data => {
          if (data.status == "success") {
            this.notifier.notify('success', 'Se ha actualizado el buzón correctamente');
            this.successed.emit();
            this.bsModalRef.hide();
          }else{
            this.notifier.notify('error', 'No se actualizó el buzón');
          }
        },
        error => {
          this.notifier.notify('error', 'No se actualizó el buzón');
        });
      }

    })



  }
}
