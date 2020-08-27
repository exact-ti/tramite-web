import { Component, OnInit } from '@angular/core';
import { MensajeEnum } from 'src/app/enum/mensaje.enum';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import { IRecorridoRepository } from 'src/app/core/repository/recorrido.repository';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-reporte-recorridos',
  templateUrl: './reporte-recorridos.component.html',
  styleUrls: ['./reporte-recorridos.component.css']
})
export class ReporteRecorridosComponent implements OnInit {

  constructor(
    private recorridoRepository: IRecorridoRepository,
  ) { }
  mensajeEnum = MensajeEnum;
  seHizoBusqueda: boolean = false;
  reporteRecorridosForm: FormGroup;
  recorridosDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  registros = [];

  ngOnInit(): void {
    this.configurarTabla();
    this.inicializarForm();
  }


  inicializarForm(): void {
    this.reporteRecorridosForm = new FormGroup({
      "desde": new FormControl(null, Validators.required),
      "hasta": new FormControl(null, Validators.required),
    });
  }

  submit(value): void {
    this.registros = [];
    this.recorridoRepository.listarReporteRecorridos(value.desde, value.hasta).pipe(take(1)).subscribe(rpta => {
      if (rpta.status == "success") {
        this.registros = rpta.data.map(element => {
          return {
            id: element.id,
            nombre: element.nombre,
            horaInicioBase: element.horaInicioBase,
            horaFinBase: element.horaFinBase,
            utdOrigen: element.utd,
            usuarioCreacion: element.usuarioCreacion,
            fechaCreacion: element.fechaCreacion,
            fechaInicio: element.fechaInicio,
            fechaFin: element.fechaFin,
            estado: element.estado,            
          }
        });
      }else{        
        console.log(rpta);
      }
      this.recorridosDS.load(this.registros);
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
      utd: {
        title: 'UTD'
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
