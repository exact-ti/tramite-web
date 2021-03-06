import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IPalomarRepository } from 'src/app/core/repository/palomar.repository';
import { Palomar } from 'src/app/core/model/palomar.model';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';
import { PalomarModalComponent } from './palomar-modal/palomar-modal.component';

@Component({
  selector: 'app-palomares',
  templateUrl: './palomares.component.html',
  styleUrls: ['./palomares.component.css']
})
export class PalomaresComponent implements OnInit {

  constructor(    private modalService: BsModalService,
    private palomarRepository: IPalomarRepository) { }

    public palomares: any[]= [];
    public palomarModal : Palomar;
    public modalTipoId : number;
    public mensaje : String;
    settings = UtilsService.tableSettings;
    dataPalomares: LocalDataSource = new LocalDataSource();
    columnas = {};

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(()=> this.inicializarPalomares());    
    this.generarColumnas();
    this.settings.hideSubHeader = false;
  }

  @Output() palomarCreadoEvent = new EventEmitter<File>();

  
  generarColumnas() {
    this.columnas = {
      id: {
        title: 'Código palomar'
      },
      ubicacion: {
        title: 'Ubicación'
      },
      tipo: {
        title: 'Tipo'
      },
      destino: {
        title: 'Destino'
      },
      estado: {
        title: 'Estado'
      },    
    }
    this.settings.columns = {
      ...this.columnas,
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


  onAgregar() {
    this.modalTipoId=1;
    this.modelPalomar(null,this.modalTipoId);
  }
  
  onEditar(row){
    this.modalTipoId=2;
    this.modelPalomar(row,this.modalTipoId);
  }


  inicializarPalomares(): void {
    this.palomares = [];
    this.dataPalomares.reset();
    this.palomarRepository.listarPalomaresPrincipal().pipe(take(1)).subscribe(
      (palomares) => {
        palomares.forEach(
          palomar => {
            this.palomares.push({
              id: palomar.id,
              ubicacion:palomar.ubicacion,
              tipo:palomar.tipoPalomar,
              destino:palomar.destino,
              estado:palomar.activo == true ? "Activo" : "Inactivo",
            })
          }
        )
        this.dataPalomares.load(this.palomares);
      }
    )
} 

  
modelPalomar(row,modalId) {
  if(row!=null){
    this.palomarModal = this.palomares.find(palomar => palomar.id == row.id);
  }else{
    this.palomarModal=null
  }
  let bsModalRef: BsModalRef = this.modalService.show(PalomarModalComponent, {
    initialState: {
      tipoModalId: modalId,
      palomar:  this.palomarModal,
      titulo: this.palomarModal==null ? 'Nuevo Palomar' : 'Modificar Palomar'+" "+row.id
    },
    class: 'modal-md',
    keyboard: false,
    backdrop: "static"
  });
  
  bsModalRef.content.palomarCreadoEvent.subscribe(() =>
    this.inicializarPalomares()
  ) 
}
  

}
