import { Component, OnInit } from '@angular/core';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { take } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-envios-activos',
  templateUrl: './envios-activos.component.html',
  styleUrls: ['./envios-activos.component.scss']
})
export class EnviosActivosComponent implements OnInit {

  constructor(
    private envioRepository: IEnvioRepository
  ) { }

  public tabs: string[] = ['Entrada', 'Salida'];
  public tabActiva: string = 'Entrada';

  public enviosWrappers: any[] = [];

  ngOnInit(): void {
    AppConfig.DespuesDeInicializar(()=> this.listar(this.tabActiva));    
  }

  activarTab(item: string){
    if (item === this.tabActiva) {
      return;
    }
    this.tabActiva = item;
    this.listar(item);
  }

  private listar(item): void {
    this.envioRepository.listarActivosDelBuzon(item).pipe(take(1)).subscribe((data) => {
      this.enviosWrappers = data.map((elemento)=> {
        if (item == 'Entrada') {
          elemento.destinatario = null;
        }else{
          elemento.remitente = null;
        }
        return this.addWrapper(elemento);
      });
    });
  }

  private addWrapper(data): {} {
    return {
      seleccionado: false,
      data
    }
  }

}
