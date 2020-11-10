import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/utils/utils';
import * as lodash from 'lodash-es';

@Component({
  selector: 'app-detalle-error',
  templateUrl: './detalle-error.component.html',
  styleUrls: ['./detalle-error.component.css']
})
export class DetalleErrorComponent implements OnInit {

  @Input() mensaje = "Sin mensaje";
  @Input() lista = [];
  mostrarCabecera = true;
  erroresDS: LocalDataSource = new LocalDataSource();
  settings = UtilsService.tableSettings;

  constructor(
    public bsModalRef: BsModalRef,
  ) { }



  ngOnInit(): void {
    this.inicializarColumnas();
    this.inicializarTabla();
  }
  
  
  
  
  inicializarColumnas() {
    this.settings.columns = {};
    Object.keys(this.lista[0]).forEach(item => {
      this.settings.columns[item] = {
        title: lodash.startCase(item),
      };
    });
  }
  
  inicializarTabla() {
    this.erroresDS.load(this.lista);
  }
}