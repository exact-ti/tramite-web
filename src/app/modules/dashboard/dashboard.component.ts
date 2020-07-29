import { Component, OnInit } from '@angular/core';
import { IDashboardRepository } from 'src/app/core/repository/dashboard.repository';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';
import { IDocflowRepository } from 'src/app/core/repository/docflow.repository';
import { SubmitForm } from 'src/app/utils/submit-form';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public integracionDocflow: boolean;
  public estadosDocflow = [];

  constructor(
    private dashboardRepository: IDashboardRepository,
    private docflowRepository: IDocflowRepository,
    private submitForm: SubmitForm,    
  ) { }
  public indicadoresSalida: any;
  public indicadoresEntrada: any;

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(() => {
      this.integracionDocflow = AppConfig.INTEGRACION_DOCFLOW;
      this.listarIndicadores();
      if (this.integracionDocflow) {
        this.listarIndicadoresDocflow();
      }
    });
  }

  private listarIndicadores(): void {
    this.dashboardRepository.listarIndicadores().pipe(take(1)).subscribe((data) => {
      this.indicadoresSalida = data.data.salida;
      this.indicadoresEntrada = data.data.entrada;
    });
  }



  private listarIndicadoresDocflow(): void {
    this.docflowRepository.listarIndicadores().pipe(take(1)).subscribe(respuesta => {
      if (respuesta.status == "success") {
        this.estadosDocflow = respuesta.data;
      }else{
        alert(respuesta.mensaje);
      }
    });
  }

  public detalleIndicadorDocflow(item): void {
    this.docflowRepository.listarParametrosIndicadorDetalle(item.tipoDescargo).subscribe(respuesta => {
      if (respuesta.status == "success") {
        let data = respuesta.data;
        this.submitForm.submit({
          method: "POST",
          action: "https://www.docflowconsultas.com.pe/siddf/webservice/GetDataParam", 
          target: "_blank",
        }, data);
      }
    });
  }
}
