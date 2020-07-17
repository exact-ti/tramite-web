import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { take } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef,
    public areaRepository: IAreaRepository,
    public usuarioRepository: IUsuarioRepository,
    public buzonRepository: IBuzonRepository,
  ) { }

  tipoFormulario: number;
  buzonFormInitialState: any = {
    nombre: '',
    area: null,
    activo: true,
  };
  buzonGenericoId: number;
  buzonForm: FormGroup;
  mostrar: any;
  areas: any[] = [];
  usuarios: any[] = [];
  usuariosSeleccionadas: any[] = [];
  usuariosSeleccionadasInitialState: any[] = [];
  usuario: any;
  probar: any;
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

      this.usuariosSeleccionadas = data.usuarios != null ? this.usuarios.filter(utd => data.usuarios.findIndex(utd2 => utd2.id == utd.id) > -1) : [];
      this.usuariosSeleccionadasInitialState = [...this.usuariosSeleccionadas];
      this.inicializarForm();
    }
  }


  listarAreas() {
    return this.areaRepository.listarAreasDeUTD(true).pipe(take(1)).toPromise();
  }


  listarDetalleBuzon() {
    return this.buzonRepository.listarDetalleBuzon(this.buzonGenericoId).pipe(take(1)).toPromise();
  }

  listarUsuarios() {
    return this.usuarioRepository.listarUsuariosConBuzon().pipe(take(1)).toPromise();
  }

  private formValidator(form: FormGroup): ValidationErrors | null {
/*          if (this.usuariosSeleccionadas.length == 0) {
          return {
            noUsuarios: true
          }
        }  */
        if(this.buzonForm){
          if(this.buzonFormInitialState.nombre==this.buzonForm.value.nombre){
            if(this.buzonFormInitialState.activo==this.buzonForm.value.activo){
              if(this.buzonForm.value.area!=null){
                var areaInitial = this.buzonFormInitialState.area;
                var areaForm= this.buzonForm.value.area;
                if(areaInitial.id==areaForm.id){
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
        }else{
          return {
            noDefinido: true
          }
        }


    return null;
  }

  removerUsuario(usuario: any) {
    this.usuariosSeleccionadas.splice(this.usuariosSeleccionadas.findIndex(usuarioSeleccionada => usuarioSeleccionada == usuario), 1);
    this.buzonForm.updateValueAndValidity();
  }

  cerrar() {
    this.bsModalRef.hide();
  }

  agregarUsuario(usuario: any) {
    if (usuario) {
      if (this.usuariosSeleccionadas.findIndex(usuariosSeleccionadas => usuariosSeleccionadas == usuario) == -1) {
        this.usuariosSeleccionadas.push(usuario);
        this.buzonForm.updateValueAndValidity();
      } else {
        alert('No puedes agregar un área que ya está en la lista');
      }
    }
    this.usuario = null;
  }


  submit(value: any) {
    value.usuarios = this.usuariosSeleccionadas;
    if (this.tipoFormulario == 1) {
      this.buzonRepository.registrarBuzon(value).pipe(take(1)).subscribe(data => {
        if (data.status == "success") {
          alert("Usuario creado");
          this.bsModalRef.hide();
        }
      });
    } else {
      this.buzonRepository.editarBuzon(this.buzonGenericoId, value).pipe(take(1)).subscribe(data => {
        if (data.status == "success") {
          alert("Usuario actualizado");
          this.bsModalRef.hide();
        }
      });
    }

  }
}
