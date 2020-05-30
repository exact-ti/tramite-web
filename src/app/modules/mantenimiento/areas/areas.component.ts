import { Component, OnInit } from '@angular/core';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Area } from 'src/app/core/model/area.model';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NuevaAreaComponent } from './nueva-area/nueva-area.component';
import { ModificarAreaComponent } from './modificar-area/modificar-area.component';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private areaRepository: IAreaRepository
  ) { }

  public areas: any[];
  public enviosWrappers: any[] = [];
  public areaModal : Area;
  public modalTipoId : number;

  ngOnInit(): void {
    this.inicializarAreas();
  }

  
  inicializarAreas(): void {
    AppConfig.onInicialization.pipe(take(1)).subscribe(()=> {
      this.areaRepository.listarAreasbySede().pipe(take(1)).subscribe(
        (data) => {
          this.areas=data;
          this.enviosWrappers = data.map((elemento)=> {
            return this.addWrapper(elemento);
          });
        }
      )
    });    
  } 
  
  private addWrapper(data): {} {
    return {
      seleccionado: false,
      data
    }
  }

  onAgregar() {
    this.modalTipoId=1;
    this.agregarArea(null,this.modalTipoId);
  }

  onEditar(row){
    this.modalTipoId=2;
    this.agregarArea(row,this.modalTipoId);
  }

  onSubmit(form: any) {
 
  }



  agregarArea(row,modalId) {
    if(row!=null){
      this.areaModal = this.areas.find(area => area.id == row);
    }else{
      this.areaModal=null
    }
    let bsModalRef: BsModalRef = this.modalService.show(NuevaAreaComponent, {
      initialState: {
        tipoModalId: modalId,
        area:  this.areaModal,
        titulo: this.areaModal==null ? 'NUEVA ÁREA' : 'MODIFICAR ÁREA'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.ambitoCreadoEvent.subscribe(() =>
      this.inicializarAreas()
    ) 
  }

  modificarProducto(row) {
    this.areaModal = this.areas.find(area => area.id == row);
    let bsModalRef: BsModalRef = this.modalService.show(ModificarAreaComponent, {
      initialState: {
        id: row,
        area: this.areaModal,
        titulo: 'Modificar el producto'
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });

    /*bsModalRef.content.productoModificadoEvent.subscribe(() =>
      this.listarProductos()
    )*/
  }
}
