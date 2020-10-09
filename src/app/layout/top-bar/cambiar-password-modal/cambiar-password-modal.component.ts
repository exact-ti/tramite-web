import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';

@Component({
  selector: 'app-cambiar-password-modal',
  templateUrl: './cambiar-password-modal.component.html',
  styleUrls: ['./cambiar-password-modal.component.css']
})
export class CambiarPasswordModalComponent implements OnInit {

  constructor(
    private bsModalRef: BsModalRef,
    private notifier: NotifierService,
    private usuarioRepository: IUsuarioRepository,
  ) { }

  passwordForm: FormGroup;

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      'passwordActual': new FormControl("", Validators.required),
      'passwordNuevo': new FormControl("", Validators.required),
      'passwordNuevo2': new FormControl("",  [Validators.required, this.passwordIgualesValidator.bind(this)]),
    });
  }

  cerrar(): void {
    this.bsModalRef.hide();
  }

  passwordIgualesValidator({ value }: AbstractControl): ValidationErrors | null {
    if (this.passwordForm) {
      if (value !== this.passwordForm.value.passwordNuevo) {
        return {
          noIguales: true
        }
      }
    }    
    return null;
  }

  onSubmit(value): void {
    this.usuarioRepository.cambiarPassword(value.passwordActual, value.passwordNuevo).subscribe(rpta => {
      if (rpta.status == "success") {
        this.notifier.notify("success", "Se ha actualizado la contraseña correctamente");
        this.bsModalRef.hide();
      }else{
        this.notifier.notify(rpta.status == "fail"? "warning":"error", rpta.message);
      }
    });
  }

}
