import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription, of, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Palomar } from 'src/app/core/model/palomar.model';
import { IPalomarRepository } from 'src/app/core/repository/palomar.repository';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { UtilsService } from 'src/app/utils/utils';
import { take } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/modules/shared/modals/confirm-modal/confirm-modal.component';
import { Area } from 'src/app/core/model/area.model';
import { DropEffect, DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-palomar-modal',
  templateUrl: './palomar-modal.component.html',
  styleUrls: ['./palomar-modal.component.css']
})
export class PalomarModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService,
    private palomarRepository: IPalomarRepository, private utilsService: UtilsService,
    private areaRepository: IAreaRepository, private notifier: NotifierService) { }
  agregarForm: FormGroup;
  titulo: String;
  palomar: Palomar;
  probar: String;
  respuesta: boolean = false;
  palomares: Palomar[] = [];
  areas: Area[] = [];
  activo: boolean;
  area: any;
  tipoModalId: number;
  tipoPalomar:boolean = true;
  sedeSubscription: Subscription;
  palomarSubscription: Subscription;
  modificarpalomarSubscription: Subscription;
  areasSeleccionadasInitialState: any[] = [];
  areasSeleccionadas: any[] = [];
  registrarPalomar: any;
  palomarFormInitialState: any = {
    codigo: '',
    tipo: 'AREA',
    ubicacion: '',
    activo: true,
  };

  ngOnInit(): void {
    this.inicializarForm();
    if (this.tipoModalId == 2) {
      this.listarDetallePalomar();
    }
    this.cargarDatosVista();
  }
  @Output() palomarCreadoEvent = new EventEmitter<any>();


  inicializarForm(): void {
    this.agregarForm = new FormGroup({
      'codigo': new FormControl(this.palomarFormInitialState.codigo),
      'tipo': new FormControl(this.palomarFormInitialState.tipo),
      'ubicacion': new FormControl(this.palomarFormInitialState.ubicacion, Validators.required),
      'activo': new FormControl( this.palomarFormInitialState.activo , Validators.required)
    }, this.formValidator.bind(this))
  }

  agregarArea(area: any) {
    if (area) {
      if (this.areasSeleccionadas.findIndex (areaSeleccionada => areaSeleccionada == area) == -1) {
        this.areasSeleccionadas.push(area);
        this.agregarForm.updateValueAndValidity();
      } else {
        alert('No puedes agregar un área que ya está en la lista');
      }
    }
    this.area = null;
  }



  async cargarDatosVista() {
    this.areas = await this.listarAreas();
    if (this.tipoModalId == 2) {
      var data = await this.listarDetallePalomar();
      this.palomarFormInitialState = {
        codigo: data.id,
        tipo: data.tipoPalomar,
        ubicacion: data.ubicacion,
        activo:  String(data.activo)
      };
      this.tipoPalomar=this.validarTipoPalomar(data.tipoPalomar);
      if(this.tipoPalomar){
        data.areas.map((area) => {
          this.areasSeleccionadas.push(area);
        })
              //this.areasSeleccionadas = this.areas.filter(area => data.areas.findIndex(area2 => area2.id == area.id) > -1);
      this.areasSeleccionadasInitialState = [...this.areasSeleccionadas];
      }
      this.inicializarForm();
    }
  }

    validarTipoPalomar(tipo :any){
        if(tipo=="AREA"){
          return true;
        }else{
          return false;
        }
    }

  private formValidator(form: FormGroup): ValidationErrors | null {

/*     if(this.agregarForm.value){
      return {
        noActivado: true
      }
    } */
    if (this.areasSeleccionadas.length == 0 && this.tipoModalId==1) {
      return {
        noAreas: true
      }
    }
      if(!this.agregarForm){
      return null;
    } 
   /*  if (this.areasSeleccionadas.length == 0 && this.tipoModalId==2) {
      return null;
  } */
    if ( JSON.stringify(this.palomarFormInitialState) ==  JSON.stringify(this.agregarForm.value)){
      if (JSON.stringify(this.areasSeleccionadasInitialState) == JSON.stringify(this.areasSeleccionadas)) {
        return {
          noCambio: true
        }
      }
    } 
     return null;    
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

  listarAreas() {
    return this.areaRepository.listarAreasSinPalomar().pipe(take(1)).toPromise();
  }

  listarDetallePalomar() {
    return this.palomarRepository.listarDetallePalomar(this.palomar.id).pipe(take(1)).toPromise();
  }

  removerArea(area: any) {
    this.areasSeleccionadas.splice(this.areasSeleccionadas.findIndex(areaSeleccionada => areaSeleccionada == area), 1);
    this.areas.push(area);
    this.agregarForm.updateValueAndValidity();
  }

  transformar(palomar: any, areas: any[]) {
    return {
      ubicacion: palomar.value.ubicacion,
      areas: areas.map((area, index) => {
        return {
          id: area.id,
          orden: index
        }
      }),
      activo: palomar.value.activo,
    }
  }

  onSubmit(form: any) {
    //let area = Object.assign({}, this.palomar);
    //his.registrarPalomar.ubicacion = this.agregarForm.get("ubicacion").value;
    //this.registrarPalomar.activo = this.agregarForm.get("activo").value;
    // this.agregarForm.areas = this.areasSeleccionadas;
    let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        mensaje: this.tipoModalId == 1 ? "¿Está seguro que desea crear?" : "¿Está seguro que desea modificar"
      }
    });
    bsModalRef.content.confirmarEvent.subscribe(() => {
      if (this.tipoModalId == 1) {
        this.modificarpalomarSubscription = this.palomarRepository.registrarPalomar(this.transformar(this.agregarForm, this.areasSeleccionadas)).subscribe(
          area => {
            this.notifier.notify('success', 'Se ha creado el area correctamente');
            this.bsModalRef.hide();
            this.palomarCreadoEvent.emit(area);
          },
          error => {
            this.notifier.notify('error', 'No se registro el area');
          }
        );
      } else {
        this.modificarpalomarSubscription = this.palomarRepository.editarPalomar(this.palomar.id, this.transformar(this.agregarForm, this.areasSeleccionadas)).subscribe(
          area => {

            this.notifier.notify('success', 'Se ha modificado el area correctamente');
            this.bsModalRef.hide();
            this.palomarCreadoEvent.emit(area);
          },
          error => {
            this.notifier.notify('error', 'No se modificó el area');
          }
        );
      }
    })

  }

}
