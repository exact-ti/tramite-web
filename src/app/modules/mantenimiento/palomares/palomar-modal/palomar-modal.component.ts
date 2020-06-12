import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription, of, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    @Output() areaCreadoEvent = new EventEmitter<any>();

    sedeSubscription: Subscription;
    palomarSubscription: Subscription;
    modificarAreaSubscription: Subscription;
    areasSeleccionadasInitialState: any[] = [];
    areasSeleccionadas: any[] = [];
    registrarPalomar: any;
    palomarFormInitialState: any = {
      id: '',
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


  inicializarForm():void{
    this.agregarForm = new FormGroup({
      'codigo': new FormControl(this.palomarFormInitialState.id, Validators.required),
      'tipo': new FormControl(this.palomarFormInitialState.tipo, Validators.required),
      'ubicacion': new FormControl(this.palomarFormInitialState.ubicacion, Validators.required),
      'activo': new FormControl(this.palomarFormInitialState.activo, Validators.required)
    })
  }

  agregarArea(area: any) {
    if (area) {
      if (this.areasSeleccionadas.findIndex(areaSeleccionada => areaSeleccionada == area) == -1) {
        this.areasSeleccionadas.push(area);
        this.agregarForm.updateValueAndValidity();
      }else{
        alert('No puedes agregar un área que ya está en la lista');
      }      
    }
    this.area = null;
  }

  onDragged( item:any, list:any[], effect: DropEffect ) {

    if( effect === "move" ) {

      const index = list.indexOf( item );
      list.splice( index, 1 );
    }
  }

  async cargarDatosVista() {
    this.areas = await this.listarAreas();
    if (this.tipoModalId == 2) {
      var data = await this.listarDetallePalomar();
      this.palomarFormInitialState = {
        id: data.id, 
        tipo: data.tipo, 
        ubicacion: data.ubicacion, 
        activo: data.activo
      };
      this.areasSeleccionadas = this.areas.filter(area => data.areas.findIndex(area2 => area2.id == area.id) > -1);
      this.areasSeleccionadasInitialState = [...this.areasSeleccionadas];
      this.inicializarForm();
    }
  }

  onDrop( event:DndDropEvent, list?:any[] ) {

    if( list
      && (event.dropEffect === "copy"
        || event.dropEffect === "move") ) {

      let index = event.index;

      if( typeof index === "undefined" ) {

        index = list.length;
      }

      list.splice( index, 0, event.data );
    }
  }  

  listarAreas(){
    return this.areaRepository.listarAreasSinPalomar().pipe(take(1)).toPromise();
  }
  
  listarDetallePalomar() {
    return this.palomarRepository.listarDetallePalomar(this.palomar.id).pipe(take(1)).toPromise();
  }

  removerArea(area:any) {
    this.areasSeleccionadas.splice(this.areasSeleccionadas.findIndex(areaSeleccionada => areaSeleccionada == area), 1);
    this.agregarForm.updateValueAndValidity();
  }

  onSubmit(form: any) {
    if (!this.utilsService.isUndefinedOrNullOrEmpty(this.agregarForm.controls['nombre'].value)) {
      let area = Object.assign({}, this.palomar);
      this.registrarPalomar.ubicacion = this.agregarForm.get("ubicacion").value;
      this.registrarPalomar.activo = this.agregarForm.get("activo").value;
      this.registrarPalomar.areas = this.areasSeleccionadas;
      let bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          mensaje: this.tipoModalId == 1?"¿Está seguro que desea crear?":"¿Está seguro que desea modificar"
        }
      });
        bsModalRef.content.confirmarEvent.subscribe(() => {
          this.modificarAreaSubscription = this.areaRepository.crearArea(area).subscribe(
            area => {
              if (this.tipoModalId == 1) {
                this.notifier.notify('success', 'Se ha creado el area correctamente');
              }else{
                this.notifier.notify('success', 'Se ha modificado el area correctamente');
              }
              this.bsModalRef.hide();
              this.areaCreadoEvent.emit(area);
            },
            error => {
              if (this.tipoModalId == 1) {
                this.notifier.notify('error', 'No se registro el area');
              }else{
                this.notifier.notify('error', 'No se modificó el area');
              }
            }
          );
        })
    }
  }

}
