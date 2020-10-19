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
  @Input() cabecera: any = {};
  @Input() nombreReporte: string = "descarga"

  constructor(
    private excelService: ExcelService,
    private utils: UtilsService,
  ) { }

  ngOnInit(): void {
  }

  exportar(): void {
    this.renameProperties();
    this.excelService.exportAsExcelFile(this.registros, this.nombreReporte);
  }

  private renameProperties(): void {
    let keys = Object.keys(this.registros[0]);
    var rg = this.utils.copy(this.registros);
    rg.forEach(registro => {
      keys.forEach(key => {
        var titulo = this.cabecera[key] ? this.cabecera[key].title : "ID";
        Object.defineProperty(registro, titulo,
          Object.getOwnPropertyDescriptor(registro, key));
        delete registro[key];
      });
    });
  }

}
