import { Component, OnInit, Input } from '@angular/core';
import { ExcelService } from 'src/app/utils/excel-service';
import { UtilsService } from 'src/app/utils/utils';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  @Input() registros: any = [];
  registrosConCabeceras = [];
  @Input() cabecera: any = {};
  @Input() nombreReporte: string = "descarga";
  @Input() nombreHoja: string = "data";

  constructor(
    private excelService: ExcelService,
    private utils: UtilsService,
  ) { }

  ngOnInit(): void {
  }

  exportar(): void {
      this.renameProperties();
      this.excelService.exportAsExcelFile(this.registrosConCabeceras, this.nombreReporte, this.nombreHoja);    
  }

  private renameProperties(): void {
    
    let keys = Object.keys(this.cabecera);
    if (this.registros.length > 0) {
    this.registrosConCabeceras = this.utils.copy(this.registros);
    this.registrosConCabeceras.forEach(registro => delete registro["id"]);
    this.registrosConCabeceras.forEach(registro => {
      keys.forEach(key => {
        var titulo = this.cabecera[key] ? this.cabecera[key].title : "ID";
        Object.defineProperty(registro, titulo,
          Object.getOwnPropertyDescriptor(registro, key));
        delete registro[key];
      });
    });
    }else{
      this.registrosConCabeceras = [];
      let cabecera = {};
      keys.forEach(key =>{
          cabecera[this.cabecera[key].title] = "";
      });
      this.registrosConCabeceras.push(cabecera);
    }  
  }

}
