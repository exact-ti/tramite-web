import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { take } from 'rxjs/operators';
import { ExcelService } from 'src/app/utils/excel-service';
import { UtilsService } from 'src/app/utils/utils';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';
import { IContingenciaRepository } from 'src/app/core/repository/contingencia.repository';
import * as $ from 'jquery';
import * as moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DetalleErrorComponent } from '../shared/modals/detalle-error/detalle-error.component';

@Component({
  selector: 'app-contingencia',
  templateUrl: './contingencia.component.html',
  styleUrls: ['./contingencia.component.css']
})
export class ContingenciaComponent implements OnInit {

  constructor(
    private excelService: ExcelService,
    private notifier: NotifierService,
    private utils: UtilsService,
    private customDatePipe: CustomDatePipe,
    private contingenciaRepository: IContingenciaRepository,
    private modalService: BsModalService,
  ) { }
  public modalRef: BsModalRef;
  envios: any[] = [];
  enviosDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  cargoContingencia: File = null;
  cabeceras = [
    'PAQUETE',
    'FECHA',
  ];

  columnasExcel = {};


  ngOnInit(): void {
    this.configurarTabla();
    this.cabeceras.forEach(cabecera => this.columnasExcel[cabecera] = {
      title: cabecera,
    });
  }

  handleFileInput(files: FileList) {
    this.enviosDS.load([]);
    this.envios = [];
    if (files.length > 0) {
      var file: File = files.item(0);
      if (file.name.split('.').pop() != 'xlsx') {
        this.notifier.notify('warning', 'El formato del archivo ' + file.name + ' no es correcto');
        $('#archContingencia').val('');
      }
      this.excelService.getSheet(file, 'Contingencia').pipe(take(1)).subscribe(data => {
        this.envios = this.obtenerEnvios(data, file.name);
        if (this.envios) {
          this.enviosDS.load(this.envios);
        }
      });
    }
  }

  handleCargoFile(files: FileList) {
    if (files.length > 0) {
      this.cargoContingencia = files.item(0);
    } else {
      this.cargoContingencia = null;
    }
  }

  submit(): void {
    this.contingenciaRepository.registrarContingencia(this.envios, this.cargoContingencia).pipe(take(1)).subscribe(rpta => {
      if (rpta.status == 'success') {
        this.notifier.notify("success", "Se ha registrado la contingencia correctamente");
        this.resetForm();
      } else if (!rpta.data) {
        this.notifier.notify(rpta.status == "fail" ? "warning" : "error", rpta.message);
      } else {
        this.mostrarDetalleErrores(rpta);
      }
    });
  }


  configurarTabla(): void {
    this.settings.columns = {
      paquete: {
        title: 'Código de paquete'
      },
      fechaEntrega: {
        title: 'Fecha entrega'
      },
    }
  }

  showError(mensaje: string): void {
    this.notifier.notify('warning', mensaje);
    $('#archContingencia').val('');
  }

  obtenerEnvios(sheet, fileName): any[] {
    if (!sheet) {
      this.showError('No existe la hoja Contingencia en el archivo ' + fileName);
      return;
    }
    let cabeceras = this.excelService.listarCabeceras(sheet);
    if (JSON.stringify(this.cabeceras) !== JSON.stringify(cabeceras)) {
      this.showError('Las cabeceras deben ser las siguientes: ' + this.cabeceras.join(', '));
      return;
    }
    let rows = this.excelService.toJson(sheet, this.cabeceras);
    if (rows.find(row =>
      JSON.stringify(Object.keys(row)) !== JSON.stringify(this.cabeceras)
    )) {
      this.showError('Algunos registros tienen celdas en blanco');
      return;
    }
    let envios = rows.map(row => {
      return {
        paquete: row.PAQUETE,
        fechaEntrega: this.customDatePipe.transform(this.utils.excelDateToJSDate(row.FECHA).toString(), 'L LT'),
      };
    });
    if (envios.find(envio => envio.fechaEntrega === 'Fecha invalida')) {
      this.showError('Algunos registros tienen fechas inválidas');
      return;
    }
    var fechaActual = moment();
    if (envios.find(envio => {
      var fechaEntrega = moment(envio.fechaEntrega, "DD/MM/YYYY hh:mm");
      return fechaEntrega > fechaActual
    })) {
      this.showError('Algunos registros tienen fechas de entrega mayores que la actual');
      return;
    }


    let paquetes = envios.map(envio => envio.paquete);
    paquetes = paquetes.slice().sort();
    let repetidos = [];

    for (let i = 0; i < paquetes.length; i++) {
      if (paquetes[i + 1] == paquetes[i]) {
        repetidos.push(paquetes[i]);
      } else {
        if (i > 0 && paquetes[i - 1] == paquetes[i]) {
          repetidos.push(paquetes[i]);
        }
      }
    }

    if (repetidos.length > 0) {
      this.showError('Los siguientes paquetes se repiten: ' + repetidos.join(', '));
      return;
    }
    return envios;  
  }

  resetForm(): void {
    this.enviosDS.load([]);
    this.envios = [];
    $('#archContingencia').val('');
    $('#cargoContingencia').val('');
  }


  mostrarDetalleErrores(rpta): void {
    var lista = [];
    var mostrarCabecera = true;
    if (rpta.data[0].tieneError) {
      lista = rpta.data.map(d => {
        return {
          ...d.objeto,
          Error: d.error,
        }
      });
    } else {
      lista = rpta.data.map(s => {
        return {
          Paquete: s
        }
      });
      mostrarCabecera = false;
    }

    let bsModalRef: BsModalRef = this.modalService.show(DetalleErrorComponent, {
      initialState: {
        mostrarCabecera,
        mensaje: rpta.message,
        lista,
      },
      class: 'modal-lg',
      keyboard: false,
      backdrop: "static"
    }); 

    bsModalRef.content.successed.subscribe(() => {
      this.notifier.notify('error', 'No se registró la contingencia');
      this.resetForm();
    })
  }





}
