import { Component, OnInit } from '@angular/core';
import { ILoteRepository } from 'src/app/core/repository/lote.repository';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { take } from 'rxjs/operators';
import { MensajeEnum } from 'src/app/enum/mensaje.enum';

@Component({
  selector: 'app-reporte-interconexiones',
  templateUrl: './reporte-interconexiones.component.html',
  styleUrls: ['./reporte-interconexiones.component.css']
})
export class ReporteInterconexionesComponent implements OnInit {

  constructor(
    private loteRepository: ILoteRepository,
  ) { }
  mensajeEnum = MensajeEnum;
  seHizoBusqueda: boolean = false;
  reporteInterconexionesForm: FormGroup;
  lotesDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  registros = [];

  ngOnInit(): void {
    this.configurarTabla();
    this.inicializarForm();
  }


  inicializarForm(): void {
    this.reporteInterconexionesForm = new FormGroup({
      "desde": new FormControl(null, Validators.required),
      "hasta": new FormControl(null, Validators.required),
    });
  }

  submit(value): void {
    this.registros = [];
    this.loteRepository.listarReporteLotes(value.desde, value.hasta).pipe(take(1)).subscribe(rpta => {
      if (rpta.status == "success") {
        this.registros = rpta.data.map(element => {
          return {
            id: element.id,
            nombre: element.id,
            horaInicioBase: element.id,
            horaFinBase: element.id,
            utdOrigen: element.id,
            utdDestino: element.id,
            usuarioCreacion: element.usuarioCreacion,
            fechaCreacion: element.id,
            fechaInicio: element.id,
            fechaFin: element.id,
            estado: element.id,            
          }
        });
      }else{        
        console.log(rpta);
      }
      this.lotesDS.load(this.registros);
    });
    this.seHizoBusqueda = true;
    
  }





  configurarTabla(): void {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      nombre: {
        title: 'Nombre Interconexión'
      }, 
      horaInicioBase: {
        title: 'Hora Inicio Base',
      },
      horaFinBase: {
        title: 'Hora Fin Base',
      },
      utdOrigen: {
        title: 'UTD Origen'
      },
      utdDestino: {
        title: 'UTD Destino'
      },
      usuarioCreacion: {
        title: 'Usuario'
      },
      fechaCreacion: {
        title: 'Fecha Creación'
      },
      fechaInicio: {
        title: 'Fecha Inicio'
      },
      fechaFin: {
        title: 'Fecha Fin'
      },
      estado: {
        title: 'Estado'
      },
    }
  }

}