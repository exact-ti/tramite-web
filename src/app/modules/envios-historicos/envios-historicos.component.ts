import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { take } from 'rxjs/operators';
import { MensajeEnum } from 'src/app/enum/mensaje.enum';
import { UtilsService } from 'src/app/utils/utils';

@Component({
  selector: 'app-envios-historicos',
  templateUrl: './envios-historicos.component.html',
  styleUrls: ['./envios-historicos.component.css']
})
export class EnviosHistoricosComponent implements OnInit {

  constructor(
    public envioRepository: IEnvioRepository,
    public utils: UtilsService,
  ) { }

  tabs: string[]  = ['Entrada', 'Salida']; 
  tabActiva: string = 'Entrada';
  enviosWrappers: any[] = [];
  seHizoBusqueda: boolean = false;
  maxDate = this.utils.dateToString(new Date());

  mensajeEnum = MensajeEnum;

  historicosForm: FormGroup;

  ngOnInit(): void {
   this.inicializarForm(); 
  }

  inicializarForm(): void {
    this.historicosForm = new FormGroup({
      "desde": new FormControl(null, Validators.required),
      "hasta": new FormControl(null, Validators.required)
    })
  };

  submit(value): void {
    this.listarEnvios(value.desde, value.hasta);
    this.seHizoBusqueda = true;
  }

  tabCambiado(event): void {
    this.tabActiva = event;
    if (this.seHizoBusqueda) {
      this.listarEnvios(this.historicosForm.get("desde").value, this.historicosForm.get("hasta").value);
    }
  }

  public listarEnvios(desde: string, hasta: string): void {
    this.envioRepository.listarPorEtapasYRangoDeFechasDelBuzon(this.tabActiva, [5], desde, hasta).pipe(take(1)).subscribe((data) => {
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

  private addWrapper(data): {} {
    return {
      seleccionado: false,
      data
    }
  }

}
