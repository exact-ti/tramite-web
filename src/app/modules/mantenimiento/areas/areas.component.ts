import { Component, OnInit } from '@angular/core';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Area } from 'src/app/core/model/area.model';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NuevaAreaComponent } from './nueva-area/nueva-area.component';
import { ModificarAreaComponent } from './modificar-area/modificar-area.component';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { UtilsService } from 'src/app/utils/utils';
import { LocalDataSource } from 'ng2-smart-table';

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
  public mensaje : String;
  settings = UtilsService.tableSettings;
  dataAreas: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    this.inicializarAreas();
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

  listarProductos() {
    this.dataAreas.reset();
    this.areaRepository.listarAreasbySede().subscribe(
      areas => {
        this.areas = areas;
        let dataProductos = [];
        areas.forEach(
          producto => {
            dataProductos.push({
              codigobandeja: areas.id,
              nombre: areas.nombre,
              ubicacion:areas.ubicacion,
              sede:areas.sede,
              tiposede:areas.tiposede,
              palomar:areas.palomar,
            })
          }
        )
        this.dataAreas.load(dataProductos);
      }
    )
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
