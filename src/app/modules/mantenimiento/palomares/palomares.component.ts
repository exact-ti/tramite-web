import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IPalomarRepository } from 'src/app/core/repository/palomar.repository';
import { Palomar } from 'src/app/core/model/palomar.model';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';
import { PalomarModalComponent } from './palomar-modal/palomar-modal.component';
import { Area } from 'src/app/core/model/area.model';

@Component({
  selector: 'app-palomares',
  templateUrl: './palomares.component.html',
  styleUrls: ['./palomares.component.css']
})
export class PalomaresComponent implements OnInit {

  constructor(    private modalService: BsModalService,
    private palomarRepository: IPalomarRepository) { }

    public areas: Area[] = [];
    public palomares: any[]= [];
    public enviosWrappers: any[] = [];
    public palomarModal : Palomar;
    public modalTipoId : number;
    public mensaje : String;
    settings = UtilsService.tableSettings;
    dataPalomares: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(()=> this.inicializarPalomares());    
    this.generarColumnas();
    this.settings.hideSubHeader = false;
  }


  
  generarColumnas() {
    this.settings.columns = {
      codigopalomar: {
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
    this.palomarRepository.listarPalomaresPrincipal().pipe(take(1)).subscribe(
      (palomares) => {
        this.palomares = palomares;
        let datapalomares = [];
        palomares.forEach(
          palomar => {
            datapalomares.push({
              codigopalomar: palomar.id,
              ubicacion:palomar.ubicacion,
              tipo:palomar.tipoPalomar,
              destino:palomar.destino,
              estado:palomar.activo,
            })
          }
        )
        this.dataPalomares.load(datapalomares);
      }
    )
} 

  
modelPalomar(row,modalId) {
  if(row!=null){
    this.palomarModal = this.palomares.find(interconexion => interconexion.id == row.codigobandeja);
  }else{
    this.palomarModal=null
  }
  let bsModalRef: BsModalRef = this.modalService.show(PalomarModalComponent, {
    initialState: {
      tipoModalId: modalId,
      palomar:  this.palomarModal,
      titulo: this.palomarModal==null ? 'NUEVO PALOMAR' : 'MODIFICAR PALOMAR'
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
