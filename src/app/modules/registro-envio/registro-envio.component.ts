import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IConfiguracionRepository } from 'src/app/core/repository/configuracion.repository';
import { Observable, config, of } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { IPaqueteRepository } from 'src/app/core/repository/paquete.repository';
import { take, map } from 'rxjs/operators';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { ErrorHandle } from 'src/app/utils/error-handle';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-registro-envio',
  templateUrl: './registro-envio.component.html',
  styleUrls: ['./registro-envio.component.scss'], 
  
})
export class RegistroEnvioComponent implements OnInit {

  constructor(
    private configuracionRepository: IConfiguracionRepository,
    private buzonRepository: IBuzonRepository,
    private paqueteRepository: IPaqueteRepository,
    private areaRepository: IAreaRepository,
    private envioRepository: IEnvioRepository,
    private errorHandle: ErrorHandle,
    private notifier: NotifierService,
  ) { }

  public caracteresMinimosBusqueda: number | string = 0;
  public envioForm: FormGroup;
  public filtroDestinatario: string = "";
  public destinatariosFrecuentesWrappers: any[] = [];
  public destinatariosFiltroWrappers: any[] = [];

  ngOnInit(): void {
    this.envioForm = new FormGroup({
      'destinatario': new FormControl(null, Validators.required),
      'paqueteId': new FormControl("", Validators.required, this.existenciaPaqueteValidator.bind(this)),
      'areaId': new FormControl("", null, this.existenciaAreaValidator.bind(this)),
      'observacion': new FormControl("")
    });
    AppConfig.DespuesDeInicializar(() => {
      this.listarCaracteresMinimosBusqueda();
      this.listarDestinatariosFrecuentes();
    });
  }

  submit(value: any): void {
    this.envioRepository.enviar(value).subscribe(data => {
      if (data > 0) {
        this.envioForm.reset({
          'destinatario': null,
          'paqueteId': '',
          'areaId':'',
          'observacion': ''
        });
        this.filtroDestinatario = "";        
        this.notifier.notify('success','Envio registrado correctamente');
        this.listarDestinatariosFrecuentes();
      }
    }, error => {
      if (error.status === 500) {
        this.errorHandle.handleServerError(error);
      } else {
        this.notifier.notify('error','Error del servidor no controlado, comuníquese con el administrador.');
        console.log(error);
      }

    })
  }

  private listarCaracteresMinimosBusqueda(): void {
    this.configuracionRepository.listarConfiguracion('CARACTERES_MINIMOS_BUSQUEDA').subscribe((configuracion) => {
      this.caracteresMinimosBusqueda = configuracion.valor;
    });
  }

  private listarDestinatariosFrecuentes(): void {
    this.buzonRepository.listarDestinatariosFrecuentes(10).subscribe((data) => {
      this.destinatariosFrecuentesWrappers = data.map(item => this.addWrapper(item));
    });
  }

  public buscarDestinatariosPorFiltro(filtro: string): void {
    this.destinatariosFiltroWrappers = [];
    this.buzonRepository.buscarDestinatariosPorFiltro(filtro).subscribe((data) => {
      this.destinatariosFiltroWrappers = data.map(item => this.addWrapper(item))
    });
  }

  public seleccionarDestinatario(wrapper: any): void {
    if (wrapper.seleccionado) {
      wrapper.seleccionado = false;
      this.envioForm.controls['destinatario'].setValue(null);
      this.filtroDestinatario = "";
    } else {
      wrapper.seleccionado = true;
      this.envioForm.controls['destinatario'].setValue(wrapper.data);

    }
  }

  private addWrapper(data): {} {
    return {
      seleccionado: false,
      data
    }
  }


  private existenciaPaqueteValidator({ value }: AbstractControl): Observable<ValidationErrors | null> {
    return this.paqueteRepository.verificarSiEsParaUso(1, value, false).pipe(take(1), map((existe: boolean) => {
      if (!existe) {
        return {
          noExiste: true
        }
      } else {
        return null;
      }
    }));
  }

  private existenciaAreaValidator({ value }: AbstractControl): Observable<ValidationErrors | null> {
    if (value.length == 0) {
      return of(null);
    } else {
      return this.areaRepository.verificarExistencia(value, false).pipe(take(1), map((existe: boolean) => {
        if (!existe) {
          return {
            noExiste: true
          }
        } else {
          return null;
        }
      }));
    }


  }




}
