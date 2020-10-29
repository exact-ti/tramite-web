import { Component, OnInit } from '@angular/core';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { take } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { IEstadoEnvioRepository } from 'src/app/core/repository/estado-envio.repository';
import { IEtapaEnvioRepository } from 'src/app/core/repository/etapa-envio.repository';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-envios-activos',
  templateUrl: './envios-activos.component.html',
  styleUrls: ['./envios-activos.component.scss']
})
export class EnviosActivosComponent implements OnInit {

  constructor(
    private envioRepository: IEnvioRepository,
    private etapaEnvioRepository: IEtapaEnvioRepository,
    private route: ActivatedRoute,
  ) { }

  public tabs: string[] = ['Entrada', 'Salida'];
  public tabActiva: string = 'Entrada';
  public redirigido: boolean = false;
  public estadosEnvios: any[] = [];
  public estadosSeleccionados: any[] = [];
  public enviosWrappers: any[] = [];

  async ngOnInit(): Promise<void> {
    AppConfig.DespuesDeInicializar(async () => {
      await this.listarEstadosEnviosNoHistoricos();
      this.route.params.subscribe(params => {
        if (params.tipo) {
          this.tabActiva = params.tipo == "salidas" ? 'Salida' : this.tabActiva;
          this.estadosSeleccionados = this.estadosSeleccionados.filter(estadoSeleccionado => estadoSeleccionado.id == params.etapa);
          this.redirigido = params.redirigido;
        }
        this.listarEnvios();
      });
    });
  }

  activarTab(item: string) {
    if (item === this.tabActiva) {
      return;
    }
    this.tabActiva = item;
    this.listarEnvios();
  }

  public listarEnvios(): void {
    this.envioRepository.listarActivosDelBuzon(this.tabActiva, this.estadosSeleccionados.map(estadoEnvio => estadoEnvio.id)).pipe(take(1)).subscribe((data) => {
      this.enviosWrappers.filter
      this.enviosWrappers = data.data.map((elemento) => {
        if (this.tabActiva == 'Entrada') {
          elemento.destinatario = null;
        } else {
          elemento.remitente = null;
        }
        return this.addWrapper(elemento);
      });
    });
  }

  private async listarEstadosEnviosNoHistoricos(): Promise<void> {
    let respuesta = await this.etapaEnvioRepository.listar(false).pipe(take(1)).toPromise();
    if (respuesta.status == "success") {
      this.estadosEnvios = respuesta.data;
      this.estadosSeleccionados = this.estadosEnvios;
    } else {
      alert(respuesta.mensaje);
    }
  }

  private addWrapper(data): {} {
    return {
      seleccionado: false,
      data
    }
  }

}
