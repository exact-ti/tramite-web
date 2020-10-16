import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { take } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(    
    private usuarioRepository: IUsuarioRepository,
    private modalService: BsModalService,) { }

    usuarios = [];
    usuariosDS: LocalDataSource = new LocalDataSource();
    settings = UtilsService.tableSettings;
  

  ngOnInit(): void {
    this.configurarTabla();
    AppConfig.DespuesDeInicializar(()=> this.listarUsuarios());    
    this.settings.hideSubHeader = false;
  }

  onAgregar() {
    this.mostrarusuarioFormulario({
      tipoFormulario: 1,
    });
  }

  mostrarusuarioFormulario(initialState) {
    let bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    this.modalService.onHidden.pipe(take(1)).subscribe((reason: String)=> {
      this.listarUsuarios();
    });
  }

  listarUsuarios(): void {
    this.usuarios = [];
    this.usuarioRepository.listarUsuariosMantenimiento().pipe(take(1)).subscribe(rpta => {
      
      if (rpta.status == "success") {
        this.usuarios = rpta.data;
        this.usuariosDS.load(rpta.data.map(item => {
          return {
            id: item.id,
            codigo: item.codigo,
            nombre:item.nombre,
            usuario: item.username,
            correo: item.correo,
            perfil: item.perfil, 
            tipoPerfil: item.tipoPerfil, 
            ubicacion: item.ubicacion,
            estado: item.activo ? 'ACTIVO' : 'INACTIVO',
          }
        }));
      }else{
        alert(rpta.mensaje);
      }

      
    });
  }

  configurarTabla(): void {
    this.settings.columns = {
      codigo: {
        title: 'Código'
      },
      nombre: {
        title: 'Nombre'
      },
      usuario: {
        title: 'Usuario'
      },
      correo: {
        title: 'Correo'
      },
      tipoPerfil: {
        title: 'Tipo Perfil'
      },
      perfil: {
        title: 'Perfil'
      },
      ubicacion: {
        title: 'Ubicación'
      },
      estado: {
        title: 'Estado'
      },
      btnEditar: {
        title: 'Editar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.mostrarusuarioFormulario({
              tipoFormulario: 2, 
              usuarioId: row.id,
            })
          });
        }
      }
    }
  }

}
