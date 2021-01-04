import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { IGrupoAgenciaRepository } from 'src/app/core/repository/grupo-agencia.repository';
import { ISedeRepository } from 'src/app/core/repository/sede.repository';
import { ITipoAgenciaRepository } from 'src/app/core/repository/tipo-agencia.repository';
import { ITipoSedeRepository } from 'src/app/core/repository/tipo-sede.repository';
import { TipoSedeEnum } from 'src/app/enum/tipo-sede.enum';
import { UtilsService } from 'src/app/utils/utils';

@Component({
  selector: 'app-sede-modal',
  templateUrl: './sede-modal.component.html',
  styleUrls: ['./sede-modal.component.css']
})
export class SedeModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public notifier: NotifierService,
    private sedeRepository: ISedeRepository,
    private tipoSedeRepository: ITipoSedeRepository,
    private tipoAgenciaRepository: ITipoAgenciaRepository,
    private grupoAgenciaRepository: IGrupoAgenciaRepository,
    private utilsService: UtilsService,
  ) { }

  paqueteExternoForm: FormGroup;
  tipoFormulario: number;
  sedeId: number;
  tiposSedes: any[] = [];
  tiposAgencias: any[] = [];
  gruposAgencias: any[] = [];
  sedeForm: FormGroup;
  tipoSedeEnum = TipoSedeEnum;

  @Output() successed = new EventEmitter();

  sedeInitialState = {
    codigo: '',
    nombre: '',
    tipoSede: null,
    tipoAgencia: null,
    grupoAgencia: null,
    activo: true,
  }


  ngOnInit(): void {
    this.inicializarForm();
    this.inicializarData();
  }


  async inicializarData(): Promise<void> {

    this.tiposSedes = (await this.tipoSedeRepository.listarTiposSedes().toPromise()).data;
    this.tiposAgencias = (await this.tipoAgenciaRepository.listarTiposAgenciasItems().toPromise()).data;

    if (this.tipoFormulario == 2) {
      let detalleSede = (await this.sedeRepository.listarDetalleDeSede(this.sedeId).toPromise()).data;
      this.sedeInitialState.codigo = detalleSede.codigo;
      this.sedeInitialState.nombre = detalleSede.nombre;
      this.sedeInitialState.tipoSede = this.tiposSedes.find(tipoSed => tipoSed.id === detalleSede.tipoSede.id);
      if (detalleSede.tipoSede.id === TipoSedeEnum.AGENCIA) {
        this.sedeInitialState.tipoAgencia = this.tiposAgencias.find(tipoAg => tipoAg.id === detalleSede.tipoAgencia.id);
        this.gruposAgencias = (await this.grupoAgenciaRepository.listarItemsPorTipoAgencia(detalleSede.tipoAgencia.id).toPromise()).data;
        this.sedeInitialState.grupoAgencia = this.gruposAgencias.find(grupoAg => grupoAg.id === detalleSede.grupoAgencia.id);
      }
    }
    this.inicializarForm();    
  }

  inicializarForm(): void {
    this.sedeForm = new FormGroup({
      'codigo': new FormControl(this.sedeInitialState.codigo, Validators.required),
      'nombre': new FormControl(this.sedeInitialState.nombre, Validators.required),
      'tipoSede': new FormControl(this.sedeInitialState.tipoSede, Validators.required),
      'tipoAgencia': new FormControl(this.sedeInitialState.tipoAgencia, this.isAgenciaValidator.bind(this)),
      'grupoAgencia': new FormControl(this.sedeInitialState.grupoAgencia,this.isAgenciaValidator.bind(this)),
      'activo': new FormControl(this.sedeInitialState.activo, Validators.required),
    }, this.formValidator.bind(this));
  }

  isAgenciaValidator({ value }: AbstractControl): ValidationErrors | null {
    let tipoSede = this.sedeForm?.get("tipoSede")?.value;
    if (tipoSede && tipoSede.id === TipoSedeEnum.AGENCIA && (value === "" || !value)) {
      return {
        invalidAgencia: true  
      }
    }
    return null;
  }

  async onTipoAgenciaSelectedChanged(tipoAgencia): Promise<void> {
    if (tipoAgencia !== null) {
      this.sedeForm.controls["grupoAgencia"].setValue(null);
      this.gruposAgencias = (await this.grupoAgenciaRepository.listarItemsPorTipoAgencia(tipoAgencia.id).toPromise()).data;
    }
  }

  

  submit(value): void {

    if (this.tipoFormulario === 1) {
      this.registrarSede(value);
    }else{
      this.actualizarSede(this.sedeId, value);
    }


  }

  registrarSede(sede): void {
    this.sedeRepository.registrarSede(sede).pipe(take(1)).subscribe(res => {
      this.controlarMensaje(res, "registrado");
    })
  }

  actualizarSede(sedeId: number, sede: any): void {
    this.sedeRepository.actualizarSede(sedeId, sede).pipe(take(1)).subscribe(res => {
     this.controlarMensaje(res, "actualizado");
    })
  }



  cerrar():void{
    this.bsModalRef.hide();
  }

  private formValidator(form: FormGroup): ValidationErrors | null {


    if (this.utilsService.deepEqual(this.sedeInitialState, form.value)) {
      return {
        sinCambios: true,
      }
    }

    return null;
  }


  controlarMensaje(res, accion: string) {
    if (res.status == "success") {
      this.successed.emit();
      this.bsModalRef.hide();
      this.notifier.notify("success", `Se ha ${accion} el perfil correctamente`);
    }else{
      this.notifier.notify(res.status == "fail" ? "warning": "error", res.message);
    }
  }



}
