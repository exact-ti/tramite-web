import { Component, OnInit } from '@angular/core';
import { ITurnoRecorridoRepository } from 'src/app/core/repository/turno-recorrido.repository';
import { take } from 'rxjs/operators';
import { UtilsService } from 'src/app/utils/utils';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TurnoRecorridoComponent } from './modal/turno-recorrido/turno-recorrido.component';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-turnos-recorridos',
  templateUrl: './turnos-recorridos.component.html',
  styleUrls: ['./turnos-recorridos.component.css']
})
export class TurnosRecorridosComponent implements OnInit {

  constructor(
    private turnoRecorridoRepository: ITurnoRecorridoRepository,
    private modalService: BsModalService,
  ) { }

  turnosRecorridosDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;


  ngOnInit(): void {
    this.configurarTabla();
    AppConfig.DespuesDeInicializar(()=> this.listarTurnosRecorridos());    
    //this.settings.hideSubHeader = false;

  }

  onAgregar() {
    this.mostrarTurnoRecorridoFormulario({
      tipoFormulario: 1,
    });
  }

  mostrarTurnoRecorridoFormulario(initialState) {
    let bsModalRef: BsModalRef = this.modalService.show(TurnoRecorridoComponent, {
      initialState
    });

    this.modalService.onHidden.pipe(take(1)).subscribe((reason: String)=> {
      this.listarTurnosRecorridos();
    });
  }

  listarTurnosRecorridos(): void {
    this.turnoRecorridoRepository.listarTurnosRecorridosDeUTD().pipe(take(1)).subscribe(data => {
      this.turnosRecorridosDS.load(data.map(item => {
        return {
          id: item.id,
          nombre: item.nombre,
          usuario: item.usuario,
          horario: item.horaInicio + " - " + item.horaFin, 
          nroAreas: item.cantidadAreas,
        }
      }));
    });
  }

  configurarTabla(): void {
    this.settings.columns = {
      id: {
        show: false,
      },
      nombre: {
        title: 'Nombre'
      },
      usuario: {
        title: 'Asignado a'
      },
      horario: {
        title: 'Horario'
      },
      nroAreas: {
        title: 'Nro Áreas'
      },
      btnEditar: {
        title: 'Editar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.mostrarTurnoRecorridoFormulario({
              tipoFormulario: 2, 
              turnoRecorridoId: row.id,
            })
          });
        }
      }
    }
  }
}
