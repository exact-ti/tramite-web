import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { take } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { IConfiguracionRepository } from 'src/app/core/repository/configuracion.repository';

@Component({
  selector: 'app-confirmacion-envios',
  templateUrl: './confirmacion-envios.component.html',
  styleUrls: ['./confirmacion-envios.component.css']
})
export class ConfirmacionEnviosComponent implements OnInit {

  constructor(
    private envioRepository: IEnvioRepository,
    private configuracionRepository: IConfiguracionRepository,
  ) { }

  public confirmacionForm: FormGroup;
  public enviosWrappers: any[] = [];
  public caracteresMinimosBusqueda: number = 0;

  ngOnInit(): void {
    this.confirmacionForm = new FormGroup({
      'paqueteId': new FormControl("", this.minimoCaracteresValidator.bind(this))
    }, this.textOrSelectValidator.bind(this));
    AppConfig.DespuesDeInicializar(() => {
      this.cargarConfiguraciones();  
      this.listar();
    });
    
  }

  private listar(): void {
    this.envioRepository.listarPorConfirmarDelBuzon().pipe(take(1)).subscribe(data => {
      this.enviosWrappers = data.map((elemento) => {
        elemento.destinatario = null;
        return this.addWrapper(elemento);
      });
    })
  }

  private addWrapper(data): {} {
    return {
      seleccionado: false,
      data
    }
  }

  submit(value) {
    let paquetesIds: string[] = [];
    if (value.paqueteId.length >= this.caracteresMinimosBusqueda ) {
      paquetesIds.push(value.paqueteId);
    }else{
      paquetesIds = this.listarSeleccionados().map(envioWrapper => envioWrapper.data.paqueteId);
    }
    this.envioRepository.confirmarEnvios(paquetesIds).pipe(take(1)).subscribe((data) => {
      if (data) {
        alert('Confirmación correcta');        
      }else{        
        alert('No fue posible confirmar el/los envíos seleccionados');
      }
      this.confirmacionForm.reset({
        paqueteId: ''
      });
      this.listar();
    })
  }

  private textOrSelectValidator(form: FormGroup): ValidationErrors | null {
    if (form.controls['paqueteId'].value.length >= this.caracteresMinimosBusqueda || this.enviosWrappers.filter(envioWrapper => envioWrapper.seleccionado).length > 0) {
      return null;
    }
    return {
      noElements: true
    }
    
  }

  private cargarConfiguraciones(): void {
    this.configuracionRepository.listarConfiguracion('CARACTERES_MINIMOS_BUSQUEDA').pipe(take(1)).subscribe((configuracion: any) => {
      
      this.caracteresMinimosBusqueda = configuracion.valor;
    });
  }

  public toggleSeleccionar(envioWrapper: any): void {
    envioWrapper.seleccionado = !envioWrapper.seleccionado
  }

  public existenSeleccionados(): boolean {
    return this.listarSeleccionados().length > 0;
  }

  private listarSeleccionados(): any[] {
    return this.enviosWrappers.filter(envioWrapper => envioWrapper.seleccionado);
  }

  public minimoCaracteresValidator({value}: AbstractControl): ValidationErrors | null {
    if (value.length >= this.caracteresMinimosBusqueda || value.length === 0) {
      return null;
    }
    return {
      minimoCaracteres: true
    }
  }

}
