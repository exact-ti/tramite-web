import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { take } from 'rxjs/operators';
import { ExcelService } from 'src/app/utils/excel-service';
import { UtilsService } from 'src/app/utils/utils';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';
import { IContingenciaRepository } from 'src/app/core/repository/contingencia.repository';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';

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
  ) { }

  envios: any[] = [];
  enviosDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;
  cargoContingencia: File = null;
  cabeceras = [
    'PAQUETE',
    'FECHA',
  ]

  ngOnInit(): void {
    this.configurarTabla();
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

  submit(): void{
    this.contingenciaRepository.registrarContingencia(this.envios, this.cargoContingencia).pipe(take(1)).subscribe(rpta => {
      if (rpta.status == 'success') {
        this.notifier.notify("success", "Se ha registrado la contingencia correctamente");
        this.resetForm();
      }else if(!rpta.data){
        this.notifier.notify(rpta.status == "fail"? "warning": "error", rpta.message);
      }else{
        this.notifier.notify(rpta.status == "fail"? "warning": "error", rpta.message + ": " + rpta.data.join(', '));
      }
    });
  }

  configurarTabla(): void {
    this.settings.columns = {
      paqueteId: {
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

  obtenerEnvios(sheet, fileName) : any[] {
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
        paqueteId: row.PAQUETE,
        fechaEntrega: this.customDatePipe.transform(this.utils.excelDateToJSDate(row.FECHA).toString(), 'L LT'),
      };
    });
    if (envios.find(envio => envio.fechaEntrega === 'Fecha invalida')) {
      this.showError('Algunos registros tienen fechas inválidas');
      return;
    }

    let paquetes = envios.map(envio => envio.paqueteId);
    paquetes = paquetes.slice().sort();
    let repetidos = [];
    for (let i = 0; i < paquetes.length - 2; i++) {
      if (paquetes[i + 1] == paquetes[i]) {
        repetidos.push(paquetes[i]);
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



}