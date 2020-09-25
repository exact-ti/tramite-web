import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ITipoPaqueteRepository } from 'src/app/core/repository/tipo-paquete.repository';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { take } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-paquete-externo-modal',
  templateUrl: './paquete-externo-modal.component.html',
  styleUrls: ['./paquete-externo-modal.component.css']
})
export class PaqueteExternoModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public tipoPaqueteRepository: ITipoPaqueteRepository,
    public modalService: BsModalService,
    public notifier: NotifierService,
  ) { }

  paqueteExternoForm: FormGroup;
  tipoFormulario: number;

  tipoPaqueteId: number;

  paqueteExternoInitialState: any = {
    nombre: '',
    activo: true,
  };


  ngOnInit(): void {
    this.inicializarForm();
  }


  inicializarForm(): void{
    this.paqueteExternoForm = new FormGroup({
      'nombre': new FormControl(this.paqueteExternoInitialState.nombre, Validators.required),
      'activo': new FormControl(this.paqueteExternoInitialState.activo),
    }, this.formValidator.bind(this));
  }

  submit(value): void {
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: this.tipoFormulario == 1 ? "¿Está seguro que desea crear?" : "¿Está seguro que desea modificar?"
      }
    });

    bsModalRef.content.confirmarEvent.pipe(take(1)).subscribe(() => {
      if (this.tipoFormulario == 1) {
        this.tipoPaqueteRepository.registrarTipoPaquete(value).subscribe(data => {
          this.mostrarRespuesta(data);
        });
      }else{
        this.tipoPaqueteRepository.actualizarTipoPaquete(this.tipoPaqueteId, value).subscribe(data => {
          this.mostrarRespuesta(data);
        });
      }
    });
  }


  cerrar() {
    this.bsModalRef.hide();
  }

  formValidator(form: FormGroup): ValidationErrors | null {
    if (JSON.stringify(this.paqueteExternoInitialState) == JSON.stringify(form.value)) {
      return {
        noCambio: true
      }
    }
    return null;
  }


  mostrarRespuesta(data): void {
    if (data.status == "success") {
      let accion = this.tipoFormulario == 1 ? 'creado': 'actualizado';
      this.notifier.notify('success', "Se ha " + accion + " el paquete externo correctamente");
      this.bsModalRef.hide();
    }else{
      this.notifier.notify('error', data.mensaje);
    }
  }

}
