import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { ISedeRepository } from 'src/app/core/repository/sede.repository';
import { UtilsService } from 'src/app/utils/utils';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { SedeModalComponent } from './sede-modal/sede-modal.component';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    private sedeRepository: ISedeRepository,
  ) { }

  sedes: any[] = [];
  sedesDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  columnas = {};

  ngOnInit(): void {
    this.configurarTabla();
    AppConfig.DespuesDeInicializar(()=> this.listarSedesDeUTD());
  }

  onAgregar() {
    this.mostrarSedeModal({
      tipoFormulario: 1,
    });
  }  

  mostrarSedeModal(initialState): void {
    let bsModalRef: BsModalRef = this.modalService.show(SedeModalComponent, {
      initialState
    });
    bsModalRef.content.successed.pipe(take(1)).subscribe(() => this.listarSedesDeUTD());
  }

  listarSedesDeUTD() {
    this.sedeRepository.listarSedesDeUTD().pipe(take(1)).subscribe(res => {
      if (res.status == "success") {
        this.sedes = res.data.map(item => {
          return { 
            id: item.id, 
            codigo: item.codigo,
            nombre: item.nombre,
            tipoSede: item.tipoSede,
            estado: item.activo ? 'Activo': 'Inactivo',           
          }
        });
        this.sedesDS.load(this.sedes);
      }
    });
  }

  configurarTabla(): void {
    this.columnas = {
      codigo: {
        title: 'Código'
      },
      nombre: {
        title: 'Nombre'
      },
      tipoSede: {
        title: 'Tipo Sede'
      },
      estado: {
        title: 'Estado'
      }
    };

    this.settings.columns = {
      ...this.columnas,
      btnEditar: {
        title: 'Editar',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) => {
          instance.claseIcono = "fas fa-wrench";
          instance.pressed.subscribe(row => {
            this.mostrarSedeModal({
              tipoFormulario: 2,
              sedeId: row.id,
            })
          });
        }
      }
    }
  }




}
