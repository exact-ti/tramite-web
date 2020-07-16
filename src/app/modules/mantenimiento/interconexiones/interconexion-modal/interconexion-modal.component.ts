import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from 'src/app/utils/utils';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Palomar } from 'src/app/core/model/palomar.model';
import { Subscription, Observable, of } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { take, map } from 'rxjs/operators';
import { Interconexion } from 'src/app/core/model/interconexion.model';
import { IInterconexionRepository } from 'src/app/core/repository/interconexion.repository';
import { ITurnoRecorridoRepository } from 'src/app/core/repository/turno-recorrido.repository';
import { DndDropEvent } from 'ngx-drag-drop';
/* import { IgxTimePickerModule } from 'igniteui-angular';
 */
@Component({
  selector: 'app-interconexion-modal',
  templateUrl: './interconexion-modal.component.html',
  styleUrls: ['./interconexion-modal.component.css']
})
export class InterconexionModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService,
    private turnoRepository: ITurnoRecorridoRepository, private utilsService: UtilsService,
    private interconexionRepository: IInterconexionRepository, private notifier: NotifierService) { }

  agregarForm: FormGroup;
  titulo: String;
  interconexion: Interconexion;
  probar: String;
  respuesta: boolean = false;
  palomares: Palomar[] = [];
  destinos: any[] = [];
  turnos: any[] = [];
  time = { hour: 13, minute: 30 };
  meridian = true;
  variable = true;
  activo: boolean;
  turno: any;
  tipoModalId: number;
  horaInicio: any;
  horaFin:any;  
  sedeSubscription: Subscription;
  palomarSubscription: Subscription;
  modificarpalomarSubscription: Subscription;
  turnosSeleccionadasInitialState: any[] = [];
  turnosSeleccionadas: any[] = [];
  turnosSeleccionadasProbar: any[] = [];
  registrarPalomar: any;
  modificarBoolean=false;
  intervalo : any = {
    horaInicio:'',
    horaFin:'',
  };  

  interconexionFormInitialState: any = {
    id: '',
    nombre: '',
    destino: '',
    activo: true,
  };
  ngOnInit(): void {
    this.inicializarForm();
    if (this.tipoModalId == 2) {
      this.listarDetalleInterconexion();
    }
    this.cargarDatosVista();
  }

  inicializarForm(): void {
    this.agregarForm = new FormGroup({
      'nombre': new FormControl(this.interconexionFormInitialState.nombre, Validators.required ,this.existenciaNombreInterconexionValidator.bind(this)),
      'destino': new FormControl(this.interconexionFormInitialState.destino, Validators.required),
      'activo': new FormControl(this.interconexionFormInitialState.activo, Validators.required),
    }, this.formValidator.bind(this))
  }

  @Output() interconexionCreadoEvent = new EventEmitter<any>();

  modificarInterconexionSubscription: Subscription;

  private existenciaNombreInterconexionValidator({ value }: AbstractControl): Observable<ValidationErrors | null> {
    if (value.length == 0) {
      return of(null);
    } else {
  
      if(this.tipoModalId==1){
  
        return this.interconexionRepository.verificarExistenciaNombre(value).pipe(take(1), map((existe: boolean) => {
          if (!existe) {
            return null;
          } else {
            return {
              noExiste: true
            }
          }
        }));
      
      }else{
        return of(null);
      }
  
    }
  }
  onDrop(event: DndDropEvent, list?: any[]) {

    if (list
      && (event.dropEffect === "copy"
        || event.dropEffect === "move")) {

      let index = event.index;

      if (typeof index === "undefined") {

        index = list.length;
      }

      list.splice(index, 0, event.data);
    }
  }
  async cargarDatosVista() {
    this.destinos = await this.listarDestinos();
    if (this.tipoModalId == 2) {
      var data = await this.listarDetalleInterconexion();
      var destino = this.destinos.find(destino => destino.id = data.destino.id);
      this.interconexionFormInitialState = {
        nombre: data.nombre,
        destino: destino,
        activo: String(data.activo),
      };
      data.turnos.map((area) => {
        this.turnosSeleccionadas.push(area);
      })
      //this.areasSeleccionadas = this.areas.filter(area => data.areas.findIndex(area2 => area2.id == area.id) > -1);
      this.turnosSeleccionadasInitialState = [...this.turnosSeleccionadas];
      this.inicializarForm();
    }
  }


  listarDestinos() {
    return this.interconexionRepository.listarDestinos().pipe(take(1)).toPromise();
  }

  listarDetalleInterconexion() {
    return this.interconexionRepository.listarDetalleInterconexion(this.interconexion.id).pipe(take(1)).toPromise();
  }

  agregarTurno(horaInicio: any,horaFin:any) {
    this.horaInicio=null;
    this.horaFin=null;
    let intervalo1 = {
      horaInicio:'',
      horaFin:'',     
    }
    if (horaInicio || horaFin) {
      intervalo1.horaInicio = horaInicio+":00";
      intervalo1.horaFin = horaFin+":00";
      if (this.validarTurnos(intervalo1.horaInicio,intervalo1.horaFin)) {
        this.turnosSeleccionadas.push(intervalo1);
        this.agregarForm.updateValueAndValidity();
      } else {
        alert('No puedes agregar un turno que ya está en la lista');
      }
    }
    this.turno = null;
  }

  validarTurnos(horaInicio: any,horaFin:any){
    this.variable = true;
    this.turnosSeleccionadas.forEach(turno => {
      if(turno.horaInicio==horaInicio && turno.horaFin==horaFin){
        this.variable =false;
      }
    })
    return this.variable ;
  }

  removerTurno(turno: any) {
    this.turnosSeleccionadas.splice(this.turnosSeleccionadas.findIndex(turnoSeleccionada => turnoSeleccionada == turno), 1);
    this.agregarForm.updateValueAndValidity();
  }

  validarLongitud(codigo: String) {
    if (codigo.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  validarundefined(codigo: String) {
    if (codigo == null) {
      return true;
    } else {
      return false;
    }

  }

  private formValidator(form: FormGroup): ValidationErrors | null {
    if (this.turnosSeleccionadas.length == 0) {
      return {
        noAreas: true
      }
    }
    if ( JSON.stringify(this.interconexionFormInitialState) ==  JSON.stringify(this.agregarForm.value)){
      if (JSON.stringify(this.turnosSeleccionadasInitialState) == JSON.stringify(this.turnosSeleccionadas)) {
        return {
          noCambio: true
        }
      }
    } 
     return null;    
  }

  transformar(interconexion: any, turnos: any[]) {
    return {
      nombre: interconexion.value.nombre,
      destinoId:interconexion.value.destino.id,
      turnos: turnos.map((area, index) => {
        return {
          horaInicio: area.horaInicio.substring(0,5) + ":00",
          horaFin:  area.horaFin.substring(0,5) + ":00",
        }
      }),
      activo: interconexion.value.activo,
    }
  }

  onSubmit(form: any) {
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: this.tipoModalId == 1 ? "¿Está seguro que desea crear?" : "¿Está seguro que desea modificar?"
      }
    });
    if (this.tipoModalId == 1) {
      bsModalRef.content.confirmarEvent.subscribe(() => {
        this.modificarpalomarSubscription = this.interconexionRepository.registrarInterconexion(this.transformar(this.agregarForm, this.turnosSeleccionadas)).subscribe(
          area => {
            this.notifier.notify('success', 'Se ha creado el area correctamente');
            this.bsModalRef.hide();
            this.interconexionCreadoEvent.emit(area);
          },
          error => {
            this.notifier.notify('error', 'No se registro el area');
          }
        );
      })
    } else {
      bsModalRef.content.confirmarEvent.subscribe(() => {
        this.modificarpalomarSubscription = this.interconexionRepository.editarInterconexion(this.interconexion.id.toString(), this.transformar(this.agregarForm, this.turnosSeleccionadas)).subscribe(
          area => {
            this.notifier.notify('success', 'Se ha modificado la interconexión correctamente');
            this.bsModalRef.hide();
            this.interconexionCreadoEvent.emit(area);
          },
          error => {
            this.notifier.notify('error', 'No se modificó la interconexión');
          }
        );
      })
    }

  }
}
