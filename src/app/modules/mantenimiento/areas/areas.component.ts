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

  public registros: any[] = [];
  public areas: any[] = [];
  public enviosWrappers: any[] = [];
  public areaModal: Area;
  public modalTipoId: number;
  public mensaje: String;
  public columnas = {};
  settings = UtilsService.tableSettings;
  dataAreas: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(() => this.inicializarAreas());
    this.generarColumnas();
    this.settings.hideSubHeader = false;
  }

  @Output() areaCreadoEvent = new EventEmitter<File>();


  generarColumnas() {
    this.columnas = {
      codigo: {
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

  inicializarAreas(): void {
    this.registros = [];
    this.areaRepository.listarAreasbySede().pipe(take(1)).subscribe(
      (areas) => {
        this.areas = areas;
        areas.forEach(
          area => {
            this.registros.push({
              id: area.id,
              codigo: area.codigo,
              nombre: area.nombre,
              ubicacion: area.ubicacion,
              sede: area.sede.descripcion,
              tiposede: area.tipoSede.descripcion,
              palomar: area.palomar?.descripcion,
              estado: area.activo ? 'Activo' : 'Inactivo',
            })
          }
        )
        this.dataAreas.load(this.registros);
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
        titulo: this.areaModal == null ? 'Nueva Área' : 'Modificar Área' + " " + row.nombre.toUpperCase()
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
