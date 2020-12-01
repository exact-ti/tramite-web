import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDashboardRepository } from 'src/app/core/repository/dashboard.repository';
import { AppConfig } from 'src/app/app.config';
import { filter, take } from 'rxjs/operators';
import { IDocflowRepository } from 'src/app/core/repository/docflow.repository';
import { SubmitForm } from 'src/app/utils/submit-form';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public integracionDocflow: boolean;
  public estadosDocflow = [];
  public routerEventsSubscription: Subscription;

  constructor(
    private dashboardRepository: IDashboardRepository,
    private docflowRepository: IDocflowRepository,
    private submitForm: SubmitForm,
    private router: Router
  ) { }


  public tiposIndicadores = [
    {
      nombre: "Entradas"
    },
    {
      nombre: "Salidas"
    }
  ];

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(() => {
      this.integracionDocflow = AppConfig.INTEGRACION_DOCFLOW;
      this.listarIndicadores();
      if (this.integracionDocflow) {
        this.listarIndicadoresDocflow();
      }
    });

    this.routerEventsSubscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.listarIndicadores();
    });
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription?.unsubscribe();
  }


  private listarIndicadores(): void {
    this.dashboardRepository.listarIndicadores().pipe(take(1)).subscribe((data) => {
      this.tiposIndicadores[0]["indicadores"] = data.data.entrada.sort((a, b) => a.id - b.id);
      this.tiposIndicadores[1]["indicadores"] = data.data.salida.sort((a, b) => a.id - b.id);
    });
  }



  private listarIndicadoresDocflow(): void {
    this.docflowRepository.listarIndicadores().pipe(take(1)).subscribe(respuesta => {
      if (respuesta.status == "success") {
        this.estadosDocflow = respuesta.data;
      } else {
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
