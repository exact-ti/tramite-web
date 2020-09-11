import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Area } from 'src/app/core/model/area.model';
import { ISedeRepository } from 'src/app/core/repository/sede.repository';
import { IPalomarRepository } from 'src/app/core/repository/palomar.repository';
import { Sede } from 'src/app/core/model/sede.model';
import { Palomar } from 'src/app/core/model/palomar.model';
import { Subscription, of, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { UtilsService } from 'src/app/utils/utils';
import { NotifierService } from 'angular-notifier';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { IAreaRepository } from 'src/app/core/repository/area.repository';

@Component({
  selector: 'app-nueva-area',
  templateUrl: './nueva-area.component.html',
  styleUrls: ['./nueva-area.component.scss']
})
export class NuevaAreaComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService,
    private sedeRepository: ISedeRepository, private palomarRepository: IPalomarRepository, private utilsService: UtilsService,
    private areaRepository: IAreaRepository, private notifier: NotifierService
  ) { }
  areaId: number;
  agregarForm: FormGroup;
  titulo: String;
  area: Area;
  probar: String;
  respuesta: boolean = false;
  sedes: Sede[] = [];
  palomares: Palomar[] = [];
  activo: boolean;
  tipoModalId: number;
  ngOnInit(): void {
    this.activo = true;
    this.agregarForm = new FormGroup({
      'codigo': new FormControl(this.area == null ? "" : this.area.codigo, Validators.required, this.existenciaAreaValidator.bind(this)),
      'nombre': new FormControl(this.area == null ? "" : this.area.nombre, Validators.required),
      'ubicacion': new FormControl(this.area == null ? "" : this.area.ubicacion, Validators.required),
      'sede': new FormControl(null, Validators.required),
      'palomar': new FormControl(null, Validators.required),
      'activo': new FormControl(this.area == null ? true : this.area.activo, Validators.required)
    })
    if (this.area != null) {
      this.areaId = this.area.id;
    }
    
    this.cargarDatosVista();
  }
  @Output() areaCreadoEvent = new EventEmitter<any>();

  sedeSubscription: Subscription;
  palomarSubscription: Subscription;
  modificarAreaSubscription: Subscription;

  cargarDatosVista() {
    this.sedes = this.sedeRepository.listarSedesSave();
    if (this.sedes && this.area != null) {
      this.agregarForm.get("sede").setValue(this.sedes.find(sede => this.area.sede.id === sede.id));
    }
    this.sedeSubscription = this.sedeRepository.listarSedes().pipe(take(1)).subscribe(
      sedesprovider => {
        this.sedes = sedesprovider;
        if (this.area != null) {
          this.agregarForm.get("sede").setValue(this.sedes.find(sede => this.area.sede.id === sede.id));
        }
      }
    )

    this.palomarSubscription = this.palomarRepository.listarPalomares().pipe(take(1)).subscribe(
      palomares => {
        this.palomares = palomares;
        if (this.area != null) {
          this.agregarForm.get("palomar").setValue(this.palomares.find(palomar => this.area.palomar.id === palomar.id));
        }
      }
    )

  }

  validarLongitud(codigo: String) {
    if (codigo.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  validarCodigo(codigo: String) {

  }

  private existenciaAreaValidator({ value }: AbstractControl): Observable<ValidationErrors | null> {
    if (value.length == 0) {
      return of(null);
    } else {

      if (this.tipoModalId == 1) {

        return this.areaRepository.verificarExistencia(value, false).pipe(take(1), map((existe: boolean) => {
          if (!existe) {
            return null;
          } else {
            return {
              noExiste: true
            }
          }
        }));

      } else {
        return of(null);
      }

    }
  }

  mostrarForm(value) {
    console.log(value);
  }

  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.agregarForm.controls['nombre'].value)) {
      let area = Object.assign({}, this.area);
      area.nombre = this.agregarForm.get("nombre").value;
      area.codigo = this.agregarForm.get("codigo").value;
      area.ubicacion = this.agregarForm.get("ubicacion").value;
      area.sede = this.agregarForm.get("sede").value;
      area.palomar = this.agregarForm.get("palomar").value;
      area.activo = this.agregarForm.get('activo').value;
      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: this.tipoModalId == 1 ? "¿Está seguro que desea crear el área?" : "¿Está seguro que desea modificar el área?"
        }
      });
      if (this.area == null) {
        bsModalRef.content.confirmarEvent.subscribe(() => {
          this.modificarAreaSubscription = this.areaRepository.crearArea(area).subscribe(
            area => {
              this.notifier.notify('success', 'Se ha creado el área correctamente');
              this.bsModalRef.hide();
              this.areaCreadoEvent.emit(area);
            },
            error => {
              this.notifier.notify('error', 'No se registro el área');
            }
          );
        })
      } else {
        bsModalRef.content.confirmarEvent.subscribe(() => {
          this.modificarAreaSubscription = this.areaRepository.modificarArea(this.areaId, area).subscribe(
            area => {
              this.notifier.notify('success', 'Se ha modificado el área correctamente');
              this.bsModalRef.hide();
              this.areaCreadoEvent.emit(area);
            },
            error => {
              this.notifier.notify('error', 'No se modificó el area');
            }
          );
        })
      }
    }
  }

}
