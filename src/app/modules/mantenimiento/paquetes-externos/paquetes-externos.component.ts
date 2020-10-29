import { Component, OnInit } from '@angular/core';
import { ITipoPaqueteRepository } from 'src/app/core/repository/tipo-paquete.repository';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { ButtonViewComponent } from '../../shared/button-view/button-view.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaqueteExternoModalComponent } from './paquete-externo-modal/paquete-externo-modal.component';
import { take, retryWhen } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-paquetes-externos',
  templateUrl: './paquetes-externos.component.html',
  styleUrls: ['./paquetes-externos.component.css']
})
export class PaquetesExternosComponent implements OnInit {

  constructor(
    public tipoPaqueteRepository: ITipoPaqueteRepository,
    public modalService: BsModalService,
  ) { }

  paquetesExternos = [];
  paquetesExternosDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  columnas = {};

  ngOnInit(): void {
    this.configurarTabla();
    AppConfig.DespuesDeInicializar(()=> this.listarPaquetesExternos());
    

  }

  listarPaquetesExternos(): void {
    this.paquetesExternos = [];
    this.tipoPaqueteRepository.listarTiposPaquetes(false, true).pipe(take(1)).subscribe(data => {
     this.paquetesExternos = data.map(item => {
        return {
          id: item.id,
          nombre: item.nombre,
          estado: item.activo ? "ACTIVO" : "INACTIVO",
        }
      });
      this.paquetesExternosDS.load(this.paquetesExternos);
    });
  }

  mostrarPaqueteExternoFormulario(initialState): void {
    let bsModalRef: BsModalRef = this.modalService.show(PaqueteExternoModalComponent, {
      initialState
    });

    bsModalRef.content.successed.pipe(take(1)).subscribe(()=>this.listarPaquetesExternos());
  }

  onAgregar(): void {
    this.mostrarPaqueteExternoFormulario({
      tipoFormulario: 1,
    });
  }


  configurarTabla(): void {
    this.columnas = {
      nombre: {
        title: 'Nombre'
      },
      estado: {
        title: 'Estado'
      },
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
            this.mostrarPaqueteExternoFormulario({
              tipoFormulario: 2,
              tipoPaqueteId: row.id,
              paqueteExternoInitialState: {
                nombre: row.nombre,
                activo: row.estado == 'ACTIVO'
              }
            })
          });
        }
      }
    }
  }




}
