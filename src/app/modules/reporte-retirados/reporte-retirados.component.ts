import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { MensajeEnum } from 'src/app/enum/mensaje.enum';
import { UtilsService } from 'src/app/utils/utils';

@Component({
  selector: 'app-reporte-retirados',
  templateUrl: './reporte-retirados.component.html',
  styleUrls: ['./reporte-retirados.component.css']
})
export class ReporteRetiradosComponent implements OnInit {

  constructor(
    private envioRepository: IEnvioRepository
  ) { }

  mensajeEnum = MensajeEnum;
  seHizoBusqueda: boolean = false;
  reporteRetiradosForm: FormGroup;
  retiradosDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  registros = [];

  ngOnInit(): void {
    this.configurarTabla();
    this.inicializarForm();
  }

  inicializarForm(): void {
    this.reporteRetiradosForm = new FormGroup({
      "desde": new FormControl(null, Validators.required),
      "hasta": new FormControl(null, Validators.required),
    });
  }

  submit(value): void {
    this.registros = [];
    this.envioRepository.listarEnviosRetiradosPorRangoDeFechas(value.desde, value.hasta).pipe(take(1)).subscribe(rpta => {
      if (rpta.status == "success") {
        this.registros = rpta.data.map(element => {
          return {
            id: element.id,
            paqueteId: element.paqueteId,
            utdOrigen: element.utdOrigen,
            tipoSedeOrigen: element.tipoSedeOrigen,
            sedeOrigen: element.sedeOrigen,
            areaOrigen: element.areaOrigen,
            remitente: element.remitente,
            utdDestino: element.utdDestino,
            tipoSedeDestino: element.tipoSedeDestino,
            sedeDestino: element.sedeDestino,
            areaDestino: element.areaDestino,
            destinatario: element.destinatario,
            fechaCreacion: element.fechaCreacion,
            fechaRetirado: element.fechaRetirado,
            usuarioRetiro: element.usuarioRetiro,
            observacion: element.observacion,
          }
        });
      }else{        
        console.log(rpta);
      }
      this.retiradosDS.load(this.registros);
    });
    this.seHizoBusqueda = true;
    
  }

  configurarTabla(): void {
    this.settings.columns = {
      id: {
        title: 'ID'
      },
      paqueteId: {
        title: 'Sobre'
      },
      utdOrigen: {
        title: 'UTD Origen'
      },
      tipoSedeOrigen: {
        title: 'Tipo Sede Origen'
      },
      sedeOrigen: {
        title: 'Sede Origen'
      },
      areaOrigen: {
        title: 'Area Origen'
      },
      remitente: {
        title: 'Remitente'
      },
      utdDestino: {
        title: 'UTD Destino'
      },
      tipoSedeDestino: {
        title: 'Tipo Sede Destino'
      },
      sedeDestino: {
        title: 'Sede Destino'
      },
      areaDestino: {
        title: 'Area Destino'
      },
      destinatario: {
        title: 'Destinatario'
      },
      fechaCreacion: {
        title: 'Fecha Creación'
      },
      fechaRetirado: {
        title: 'Fecha Retiro'
      },
      usuarioRetiro: {
        title: 'Usuario retiro'
      },
      observacion: {
        title: 'Motivo'
      },
      
    }
  }



}
