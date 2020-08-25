import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { IEstadoEnvioRepository } from 'src/app/core/repository/estado-envio.repository';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { take } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from 'src/app/utils/utils';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.css']
})
export class ReporteGeneralComponent implements OnInit {

  constructor(
    public utdRepository: IUtdRepository,
    public estadoEnvioRepository: IEstadoEnvioRepository,
    public envioRepository: IEnvioRepository,
  ) { }

  reporteGeneralForm: FormGroup;
  utds = [];
  estados = [];
  enviosDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  registros = [];

  ngOnInit(): void {
    this.configurarTabla();
    this.inicializarForm();
    this.listarUtds();
    this.listarEstados();
  }


  inicializarForm(): void {
    this.reporteGeneralForm = new FormGroup({
      "desde": new FormControl(null, Validators.required),
      "hasta": new FormControl(null, Validators.required),
      "utdsOrigenes": new FormControl([]),
      "utdsDestinos": new FormControl([]),
      "estados": new FormControl([]),
    });
  }

  listarUtds(): void {
    this.utdRepository.listarUtdsActivos().pipe(take(1)).subscribe(rpta => {
      this.utds = rpta;
    });
  }

  listarEstados(): void {
    this.estadoEnvioRepository.listar(false).pipe(take(1)).subscribe(rpta => {
      if (rpta.status == "success") {
        this.estados = rpta.data;
      } else {
        console.log(rpta.mensaje);
      }
    });
  }

  submit(value): void {
    let estadosIds = JSON.stringify(value.estados) == JSON.stringify(this.estados) ? [] : value.estados.map(item => item.id);
    let origenesIds = JSON.stringify(value.utdsOrigenes) == JSON.stringify(this.utds) ? [] : value.utdsOrigenes.map(item => item.id);
    let destinosIds = JSON.stringify(value.utdsDestinos) == JSON.stringify(this.utds) ? [] : value.utdsDestinos.map(item => item.id);
    this.envioRepository.listarReporteGeneral(value.desde, value.hasta, estadosIds, origenesIds, destinosIds).pipe(take(1)).subscribe(rpta => {
      if (rpta.status == "success") {
        this.registros = rpta.data.map(item => {
          return {
            id: item.id,
            paqueteId: item.paqueteId,
            utdOrigen: item.utdOrigen,
            tipoSedeOrigen: item.tipoSedeOrigen,
            sedeOrigen: item.sedeOrigen,
            areaOrigen: item.areaOrigen,
            remitente: item.remitente,
            utdDestino: item.utdDestino,
            tipoSedeDestino: item.tipoSedeDestino,
            sedeDestino: item.sedeDestino,
            areaDestino: item.areaDestino,
            destinatario: item.destinatario,
            fechaCreacion: !item.fechaCreacion ? '' : moment(item.fechaCreacion).tz('America/Lima').format("DD/MM/yyyy HH:mm"),
            fechaPrimeraCustodia: !item.fechaPrimeraCustodia ? '' : moment(item.fechaPrimeraCustodia).tz('America/Lima').format("DD/MM/yyyy"),
            fechaRutaAlUsuario: !item.fechaRutaAlUsuario ? '' : moment(item.fechaRutaAlUsuario).tz('America/Lima').format("DD/MM/yyyy"),
            fechaEntrega: !item.fechaEntrega ? '' : moment(item.fechaEntrega).tz('America/Lima').format("DD/MM/yyyy"),
            fechaConfirmado: !item.fechaConfirmado ? '' : moment(item.fechaConfirmado).tz('America/Lima').format("DD/MM/yyyy"),
            fechaRetirado: !item.fechaRetirado ? '' : moment(item.fechaRetirado).tz('America/Lima').format("DD/MM/yyyy"),
            estado: item.estado,
            utdResponsable: item.utdResponsable,
          }
        });
      } else {
        this.registros = [];
        
        console.log(rpta.mensaje);
      }
      this.enviosDS.load(this.registros);
    })
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
      fechaPrimeraCustodia: {
        title: 'Fecha Primera Custodia'
      },
      fechaRutaAlUsuario: {
        title: 'Fecha Ruta'
      },
      fechaEntrega: {
        title: 'Fecha Entrega'
      },
      fechaConfirmado: {
        title: 'Fecha Confirmado'
      },
      fechaRetirado: {
        title: 'Fecha Retirado'
      },
      estado: {
        title: 'Estado'
      },
      utdResponsable: {
        title: 'UTD Responsable'
      },
    }
  }

}
