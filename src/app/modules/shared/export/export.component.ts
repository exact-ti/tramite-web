import { Component, OnInit, Input } from '@angular/core';
import { ExcelService } from 'src/app/utils/excel-service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  @Input() registros: any = [];
  @Input() cabecera: any = {};

  constructor(
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
  }

  exportar(): void {
    this.renameProperties();
    this.excelService.exportAsExcelFile(this.registros, "reporte-general");
  }

  private renameProperties(): void {
    let keys = Object.keys(this.registros[0]);
    this.registros.forEach(registro => {
      keys.forEach(key => {
        Object.defineProperty(registro, this.cabecera[key].title,
          Object.getOwnPropertyDescriptor(registro, key));
      delete registro[key];
      });
    });
  }

}
