import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { take } from 'rxjs/operators';

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
    public utdRepository: IUtdRepository,) { }
    tipoFormulario: number;
    usuarioFormInitialState: any = {
      nombre: '',
      username:'',
      correo: '',
      contrasena: '',
      tipoUsuario: null,
      perfil:null,
      area:null,
      activo: true,
    };
    usuarioId: number;
    usuarioForm: FormGroup;
    tiposUsuario:any[] = [];
    perfiles: any[] = [];
    areas: any[] = [];
    utds: any[] = [];
    utdsSeleccionadas: any[] = [];
    utdsSeleccionadasInitialState: any[] = [];
    utd: any;
  ngOnInit(): void {
    this.inicializarForm();
    if (this.tipoFormulario == 2) {
      this.listarDetalleUsuario();
    }    
    this.inicializar();
  }

  async inicializar() {
    this.perfiles = await this.listarPerfiles();
    this.tiposUsuario =  await this.listarTiposUsuario();
    this.utds = await this.listarUtds();
    this.areas = await this.listarUtds();
    if (this.tipoFormulario == 2) {
      var data = await this.listarDetalleUsuario();
      this.usuarioFormInitialState = {
        nombre: data.nombre, 
        username:data.username,
        correo: data.correo,
        contrasena: data.contrasena,
        perfil: this.perfiles.find(perfil => perfil.id == data.perfil.id), 
        tipoUsuario: this.tiposUsuario.find(tipoUsuario => tipoUsuario.id == data.tipoUsuario.id),
        area: this.areas.find(area => area.id == data.area.id),
        activo: data.activo
      }
      this.utdsSeleccionadas = this.utds.filter(utd => data.utds.findIndex(utd2 => utd2.id == utd.id) > -1);
      this.utdsSeleccionadasInitialState = [...this.utdsSeleccionadas];
      this.inicializarForm();
    }     
  }

  listarUtds(){
    return this.utdRepository.listarUtds().pipe(take(1)).toPromise();
  }

  listarPerfiles() {
    return this.usuarioRepository.listarPerfilesDeUsuario().pipe(take(1)).toPromise();
  }

  listarAreas() {
    return this.areaRepository.listarAreasDeUTD(false).pipe(take(1)).toPromise();
  }

  listarTiposUsuario() {
    return this.usuarioRepository.listarTiposUsuario().pipe(take(1)).toPromise();
  }

  listarDetalleUsuario() {
    return this.usuarioRepository.listarDetalleUsuario(this.usuarioId).pipe(take(1)).toPromise();
  }

  inicializarForm(): void {
    this.usuarioForm = new FormGroup({
      nombre: new FormControl(this.usuarioFormInitialState.nombre, Validators.required),
      username: new FormControl(this.usuarioFormInitialState.username, Validators.required),
      correo: new FormControl(this.usuarioFormInitialState.correo, Validators.required),
      contrasena: new FormControl(this.usuarioFormInitialState.contrasena, Validators.required),
      tipoUsuario: new FormControl(this.usuarioFormInitialState.tipoUsuario, Validators.required),
      perfil: new FormControl(this.usuarioFormInitialState.perfil, Validators.required),
      activo: new FormControl(this.usuarioFormInitialState.activo, Validators.required),
      area:new FormControl(this.usuarioFormInitialState.area, Validators.required),
    }, this.formValidator.bind(this));
  }


  private formValidator(form: FormGroup): ValidationErrors | null {
    if (this.utdsSeleccionadas.length == 0) {
      return {
        noAreas: true
      }
    }
    if ( JSON.stringify(this.usuarioFormInitialState) ==  JSON.stringify(this.usuarioForm.value)){
        return {
          noCambio: true
        }
    } 
    return null;    
  }

  removerUtd(utd:any) {
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
      }else{
        alert('No puedes agregar un área que ya está en la lista');
      }      
    }
    this.utd = null;
  }


  submit(value: any){
    value.areas = this.utdsSeleccionadas;
    if (this.tipoFormulario == 1) {
      this.usuarioRepository.registrarUsuario(value).pipe(take(1)).subscribe(data => {
        if (data.status == "success") {
          alert("Usuario creado");
          this.bsModalRef.hide();
        }
      });
    }else{
      this.usuarioRepository.editarUsuario(this.usuarioId, value).pipe(take(1)).subscribe(data => {
        if (data.status == "success") {
          alert("Usuario actualizado");
          this.bsModalRef.hide();
        }
      });
    }
    
  }

}
