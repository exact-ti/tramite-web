import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { Interconexion } from 'src/app/core/model/interconexion.model';
import { IInterconexionRepository } from 'src/app/core/repository/interconexion.repository';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { InterconexionModalComponent } from './interconexion-modal/interconexion-modal.component';

@Component({
  selector: 'app-interconexiones',
  templateUrl: './interconexiones.component.html',
  styleUrls: ['./interconexiones.component.css']
})
export class InterconexionesComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private interconexionRepository: IInterconexionRepository
  ) { }

  public interconexiones: any[]= [];
  public enviosWrappers: any[] = [];
  public interconexionModal : Interconexion;
  public modalTipoId : number;
  public mensaje : String;
  settings = UtilsService.tableSettings;
  dataInterconexiones: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(()=> this.inicializarInterconexiones());    
    this.generarColumnas();
    this.settings.hideSubHeader = false;
  }


  generarColumnas() {
    this.settings.columns = {
      codigobandeja: {
        title: 'Código bandeja'
      },
      nombre: {
        title: 'Nombre'
      },
      ubicacion: {
        title: 'Ubicación'
      },
      sede: {
        title: 'Sede'
      },
      tiposede: {
        title: 'Tipo sede'
      },
      palomar: {
        title: 'Palomar'
      },      
      buttonModificar: {
        title: 'Editar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.onEditar(row);
          });
        }
      }
    }
  }

  inicializarInterconexiones(): void {
    this.interconexionRepository.listarInterconexiones().pipe(take(1)).subscribe(
      (interconexiones) => {
        this.interconexiones = interconexiones;
        let datainterconexiones = [];
        interconexiones.forEach(
          interconexion => {
            datainterconexiones.push({
              codigobandeja: interconexion.id,
              nombre: interconexion.nombre,
              ubicacion:interconexion.ubicacion,
              sede:interconexion.sede.descripcion,
              tiposede:interconexion.tipoSede,
              palomar:interconexion.palomar.descripcion,
            })
          }
        )
        this.dataInterconexiones.load(datainterconexiones);
      }
    )
} 

onAgregar() {
  this.modalTipoId=1;
  this.modelInterconexion(null,this.modalTipoId);
}

onEditar(row){
  this.modalTipoId=2;
  this.modelInterconexion(row,this.modalTipoId);
}


modelInterconexion(row,modalId) {
  if(row!=null){
    this.interconexionModal = this.interconexiones.find(interconexion => interconexion.id == row.codigobandeja);
  }else{
    this.interconexionModal=null
  }
  let bsModalRef: BsModalRef = this.modalService.show(InterconexionModalComponent, {
    initialState: {
      tipoModalId: modalId,
      interconexion:  this.interconexionModal,
      titulo: this.interconexionModal==null ? 'NUEVA INTERCONEXIÓN' : 'MODIFICAR INTERCONEXIÓN'
    },
    class: 'modal-md',
    keyboard: false,
    backdrop: "static"
  });
  bsModalRef.content.interconexionCreadoEvent.subscribe(() =>
    this.inicializarInterconexiones()
  ) 
}
}
