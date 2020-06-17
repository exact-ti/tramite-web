import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ISedeRepository } from 'src/app/core/repository/sede.repository';
import { IPalomarRepository } from 'src/app/core/repository/palomar.repository';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { NotifierService } from 'angular-notifier';
import { UtilsService } from 'src/app/utils/utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Palomar } from 'src/app/core/model/palomar.model';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { take } from 'rxjs/operators';
import { Interconexion } from 'src/app/core/model/interconexion.model';
import { IInterconexionRepository } from 'src/app/core/repository/interconexion.repository';
import { ITurnoRecorridoRepository } from 'src/app/core/repository/turno-recorrido.repository';
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
  destino: any = null;
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
  registrarPalomar: any;
  intervalo : any = {
    horaInicio:'',
    horaFin:'',
  };  

  palomarFormInitialState: any = {
    id: '',
    nombre: '',
    ubicacion: '',
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
      'nombre': new FormControl(this.palomarFormInitialState.nombre, Validators.required),
      'destino': new FormControl(this.palomarFormInitialState.destino),
      'ubicacion': new FormControl(this.palomarFormInitialState.ubicacion),
      'activo': new FormControl(this.palomarFormInitialState.activo, Validators.required),
      horaInicio: new FormControl(''),
      horaFin: new FormControl(''),
    })
  }

  @Output() interconexionCreadoEvent = new EventEmitter<any>();

  modificarInterconexionSubscription: Subscription;

  async cargarDatosVista() {
    this.destinos = await this.listarDestinos();
    if (this.tipoModalId == 2) {
      var data = await this.listarDetalleInterconexion();
      var destino = this.destinos.find(destino => destino.id = data.destino.id);
      this.destino = destino;
      this.palomarFormInitialState = {
        nombre: data.nombre,
        ubicacion: data.tipo,
        destino: destino.id,
        activo: data.activo
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
    if (horaInicio || horaFin) {
      this.intervalo.horaInicio = horaInicio;
      this.intervalo.horaFin = horaFin;
      if (this.turnosSeleccionadas.findIndex(turnoSeleccionada => turnoSeleccionada == this.intervalo) == -1) {
        this.turnosSeleccionadas.push(this.intervalo);
        this.agregarForm.updateValueAndValidity();
      } else {
        alert('No puedes agregar un turno que ya está en la lista');
      }
    }
    this.turno = null;
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

  validarCodigo(codigo: String) {

  }

  validarundefined(codigo: String) {
    if (codigo == null) {
      return true;
    } else {
      return false;
    }

  }

 

  transformar(interconexion: any, turnos: any[],destino:any) {
    return {
      nombre: interconexion.value.nombre,
      destinoId:destino.id,
      turnos: turnos.map((area, index) => {
        return {
          horaInicio: area.horaInicio,
          horaFin:  area.horaFin
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
        this.modificarpalomarSubscription = this.interconexionRepository.registrarInterconexion(this.transformar(this.agregarForm, this.turnosSeleccionadas,this.destino)).subscribe(
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
        this.modificarpalomarSubscription = this.interconexionRepository.editarInterconexion(this.interconexion.id.toString(), this.transformar(this.agregarForm, this.turnosSeleccionadas,this.destino)).subscribe(
          area => {
            this.notifier.notify('success', 'Se ha modificado el area correctamente');
            this.bsModalRef.hide();
            this.interconexionCreadoEvent.emit(area);
          },
          error => {
            this.notifier.notify('error', 'No se modificó el area');
          }
        );
      })
    }

  }
}
