import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IPerfilRepository } from 'src/app/core/repository/perfil.repository';

@Component({
  selector: 'app-perfil-modal',
  templateUrl: './perfil-modal.component.html',
  styleUrls: ['./perfil-modal.component.css']
})
export class PerfilModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private notifier: NotifierService,
    private perfilRepository: IPerfilRepository,
  ) { }

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

  ngOnInit(): void {
    
  }

  async inicializar() {
    this.tiposPerfiles = await this.perfilRepository.listarTipoPerfilItem().toPromise();
    
  }

  inicializarData(): void {
    if (this.tipoFormulario == 1) this.inicializarForm();
    else{
      this.perfilRepository.listarDetallePerfil(this.perfilId).subscribe(data => {
        this.perfilInitialState = {
          nombre: data.nombre,
          tipoPerfil: this.tiposPerfiles.find(tipoPerfil => tipoPerfil.id == data.tipoPerfilId),
          activo: data.activo,
        }
        this.opcionesElegidas = data.opcionesIds,
      });
    }
  }

  inicializarForm(): void {
    this.perfilForm = new FormGroup({
      'nombre': new FormControl(this.perfilInitialState.nombre, Validators.required), 
      'tipoPerfil': new FormControl(this.perfilInitialState.tipoPerfil, Validators.required),
      'activo': new FormControl(this.perfilInitialState.activo, Validators.required),
    })
  }

  

  submit(value) {

  }

  cerrar() {
    this.bsModalRef.hide();
  }

}
