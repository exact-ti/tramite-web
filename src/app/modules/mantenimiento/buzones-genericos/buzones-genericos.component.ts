import { Component, OnInit } from '@angular/core';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { AppConfig } from 'src/app/app.config';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { take } from 'rxjs/operators';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-buzones-genericos',
  templateUrl: './buzones-genericos.component.html',
  styleUrls: ['./buzones-genericos.component.scss']
})
export class BuzonesGenericosComponent implements OnInit {

  constructor(    
    private buzonRepository: IBuzonRepository,
    private modalService: BsModalService,) { }

    buzonesDS: LocalDataSource = new LocalDataSource();
    settings = UtilsService.tableSettings;
  ngOnInit(): void {    
    this.configurarTabla();
    AppConfig.DespuesDeInicializar(()=> this.listarBuzones());    
    this.settings.hideSubHeader = false;
  }
  listarBuzonesGenericos: any[] = [];

  onAgregar() {
    this.mostrarBuzonFormulario({
      tipoFormulario: 1,
    });
  }

  mostrarBuzonFormulario(initialState) {
    let bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    this.modalService.onHidden.pipe(take(1)).subscribe((reason: String)=> {
      this.listarBuzones();
    });
  }

  listarBuzones(): void {
    this.buzonRepository.listarBuzonesMantenimiento().pipe(take(1)).subscribe(data => {
      this.listarBuzonesGenericos=data.data;
      this.buzonesDS.load(this.listarBuzonesGenericos.map(item => {
        return {
          id: item.id,
          area:item.area,
          nombre: item.nombre,
          usuario: item.cantidadUsuarios,
          estado: item.activo ? "ACTIVO" : "DESACTIVADO"
        }
      }));
    });
  }

  configurarTabla(): void {
    this.settings.columns = {

      nombre: {
        title: 'Nombre'
      },
      area: {
        title: 'Área'
      },
      usuario: {
        title: 'Usuarios'
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
            this.mostrarBuzonFormulario({
              tipoFormulario: 2, 
              buzonGenericoId: row.id,
            })
          });
        }
      }
    }
  }

}
