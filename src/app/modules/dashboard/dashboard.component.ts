import { Component, OnInit } from '@angular/core';
import { IDashboardRepository } from 'src/app/core/repository/dashboard.repository';
import { AppConfig } from 'src/app/app.config';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardRepository: IDashboardRepository
  ) { }
  public indicadoresSalida: any/* = {
    creados: 0,
    enProceso: 0,
    enRuta: 0,
    entregados: 0,
  } */;
  public indicadoresEntrada: any/* = {
    creados: 0,
    enProceso: 0,
    enRuta: 0,
    entregados: 0,
  } */;

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(()=> this.listarIndicadores());    
  }

  private listarIndicadores(): void {
    this.dashboardRepository.listarIndicadores().pipe(take(1)).subscribe((data) => {
      this.indicadoresSalida=data.data.salida;
      this.indicadoresEntrada=data.data.entrada;
/*       this.indicadoresEntrada.enProceso=data.entrada.enProceso;
      this.indicadoresEntrada.enRuta=data.entrada.enRuta;
      this.indicadoresEntrada.entregados=data.entrada.entregados; */

/*       this.indicadoresSalida.enProceso=data.entrada.enProceso;
      this.indicadoresSalida.enRuta=data.entrada.enRuta;
      this.indicadoresSalida.entregados=data.entrada.entregados; */
    });
  }

}
