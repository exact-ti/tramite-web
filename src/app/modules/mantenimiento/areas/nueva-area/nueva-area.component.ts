import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Area } from 'src/app/core/model/area.model';
import { ISedeRepository } from 'src/app/core/repository/sede.repository';
import { IPalomarRepository } from 'src/app/core/repository/palomar.repository';
import { Sede } from 'src/app/core/model/sede.model';
import { Palomar } from 'src/app/core/model/palomar.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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

  constructor(    public bsModalRef: BsModalRef,    private modalService: BsModalService,
    private sedeRepository: ISedeRepository ,private palomarRepository: IPalomarRepository,private utilsService: UtilsService,
    private areaRepository: IAreaRepository,    private notifier: NotifierService 
    ) { }
  agregarForm: FormGroup;
  titulo : String;
  area : Area;
  probar : String;
  sedes : Sede[] =[];  
  palomares :Palomar[] = [];
  activo : boolean;
  tipoModalId:number;
  ngOnInit(): void {
    this.activo=true;
    this.agregarForm = new FormGroup({
      'codigo': new FormControl(this.area ==null ? "" :this.area.id, Validators.required),
      'nombre': new FormControl(this.area ==null ? "" :this.area.nombre, Validators.required),
      'ubicacion': new FormControl(this.area ==null ? "" :this.area.ubicacion, Validators.required),
      'sede': new FormControl(null, Validators.required),
      'palomar': new FormControl(null, Validators.required),
      'activo': new FormControl(this.area ==null ? true :this.area.activo, Validators.required)
    })
    this.cargarDatosVista(); 
  }
  @Output() areaCreadoEvent = new EventEmitter<any>();
  @Output() areaModificadoEvent = new EventEmitter<any>();

  sedeSubscription: Subscription;
  palomarSubscription: Subscription;
  modificarAreaSubscription: Subscription;

  cargarDatosVista() {
    this.sedes = this.sedeRepository.listarSedesSave();
    if (this.sedes) {
      this.agregarForm.get("sede").setValue(this.sedes.find(sede => this.area.sede.id === sede.id));
    }
    this.sedeSubscription = this.sedeRepository.listarSedes().pipe(take(1)).subscribe(
      sedesprovider => {
        this.sedes = sedesprovider;
        this.agregarForm.get("sede").setValue(this.sedes.find(sede => this.area.sede.id === sede.id));
      }
    )

    this.palomares = this.palomarRepository.listarPalomaresSave();
    if (this.palomares) {
      this.agregarForm.get("palomar").setValue(this.sedes.find(sede => this.area.sede.id === sede.id));
    }
    this.palomarSubscription = this.palomarRepository.listarPalomares().pipe(take(1)).subscribe(
      sedesprovider => {
        this.palomares = sedesprovider;
        this.agregarForm.get("palomar").setValue(this.sedes.find(palomar => this.area.sede.id === palomar.id));
      }
    )

  }





  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.agregarForm.controls['nombre'].value)) {
      let area = Object.assign({}, this.area);
      let nombreSinEspacios = this.agregarForm.controls['nombre'].value.trim();
      area.nombre = nombreSinEspacios;
      area.id = this.agregarForm.get("id").value;
      area.activo = this.agregarForm.get('activo').value;
      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: "¿Está seguro que desea modificar?. El cambio se verá reflejado en las áreas actuales."
        }
      });
      bsModalRef.content.confirmarEvent.subscribe(() => {
        this.modificarAreaSubscription = this.areaRepository.crearArea(area).subscribe(
          area => {
            this.notifier.notify('success', 'Se ha modificado el ámbito correctamente');
            this.bsModalRef.hide();
            this.areaModificadoEvent.emit(area);
          },
          error => {
            this.notifier.notify('error', 'El nombre modificado ya existe');
          }
        );
      })
    }
  }

}
