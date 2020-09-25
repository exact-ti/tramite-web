import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { IPerfilRepository } from 'src/app/core/repository/perfil.repository';
import { UtilsService } from 'src/app/utils/utils';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { PerfilModalComponent } from './perfil-modal/perfil-modal.component';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  constructor(
    private perfilRepository: IPerfilRepository,
    private modalService: BsModalService,
  ) { }

  perfilesDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;

  ngOnInit(): void {
    this.configurarTabla();
    this.listarPerfiles();
  }

  onAgregar(): void{
    this.mostrarPerfilFormulario({
      tipoFormulario: 1,
    });
  }

  listarPerfiles(): void {
    this.perfilRepository.listarPerfiles(true).pipe(take(1)).subscribe(data => {
      this.perfilesDS.load(data.map(item => {
        return {
          id: item.id,
          nombre: item.nombre,
          tipoPerfil: item.tipoPerfil.nombre,
          estado: item.activo ? 'ACTIVO': 'INACTIVO'
        }
      }))
    });
  }

  mostrarPerfilFormulario(initialState) {
    let bsModalRef: BsModalRef = this.modalService.show(PerfilModalComponent, {
      initialState,
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    this.modalService.onHidden.pipe(take(1)).subscribe((reason: String)=> {
      this.listarPerfiles();
    });
  }


  configurarTabla(): void {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Nombre'
      },
      tipoPerfil: {
        title: 'Tipo perfil'
      },
      estado: {
        title: 'Estado'
      },      
      buttonModificar: {
        title: 'Editar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.mostrarPerfilFormulario({
              tipoFormulario: 2,
              perfilId: row.id,
            });
          });
        }
      }
    }
  }

}
