import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Area } from 'src/app/core/model/area.model';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NuevaAreaComponent } from './nueva-area/nueva-area.component';
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

  public areas: any[] = [];
  public enviosWrappers: any[] = [];
  public areaModal: Area;
  public modalTipoId: number;
  public mensaje: String;
  settings = UtilsService.tableSettings;
  dataAreas: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(() => this.inicializarAreas());
    this.generarColumnas();
    this.settings.hideSubHeader = false;
  }

  @Output() areaCreadoEvent = new EventEmitter<File>();


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

  inicializarAreas(): void {
    this.areaRepository.listarAreasbySede().pipe(take(1)).subscribe(
      (areas) => {
        this.areas = areas;
        let dataAreas = [];
        areas.forEach(
          area => {
            dataAreas.push({
              id: area.id,
              codigobandeja: area.codigo,
              nombre: area.nombre,
              ubicacion: area.ubicacion,
              sede: area.sede.descripcion,
              tiposede: area.tipoSede,
              palomar: area.palomar.descripcion,
              estado: area.activo ? 'ACTIVO' : 'INACTIVO',
            })
          }
        )
        this.dataAreas.load(dataAreas);
      }
    )
  }



  onAgregar() {
    this.modalTipoId = 1;
    this.agregarArea(null, this.modalTipoId);
  }

  onEditar(row) {
    this.modalTipoId = 2;
    this.agregarArea(row, this.modalTipoId);
  }


  agregarArea(row, modalId) {
    if (row != null) {
      this.areaModal = this.areas.find(area => area.id == row.id);
    } else {
      this.areaModal = null
    }
    let bsModalRef: BsModalRef = this.modalService.show(NuevaAreaComponent, {
      initialState: {
        tipoModalId: modalId,
        area: this.areaModal,
        titulo: this.areaModal == null ? 'NUEVA ÁREA' : 'MODIFICAR ÁREA' + " " + row.nombre.toUpperCase()
      },
      class: 'modal-md',
      keyboard: false,
      backdrop: "static"
    });
    bsModalRef.content.areaCreadoEvent.subscribe(() =>
      this.inicializarAreas()
    )
  }

}
