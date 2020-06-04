import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DropEffect, DndDropEvent } from 'ngx-drag-drop';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';
import { take } from 'rxjs/operators';
import { ITurnoRecorridoRepository } from 'src/app/core/repository/turno-recorrido.repository';

@Component({
  selector: 'app-turno-recorrido',
  templateUrl: './turno-recorrido.component.html',
  styleUrls: ['./turno-recorrido.component.css']
})
export class TurnoRecorridoComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef, 
    public areaRepository: IAreaRepository,
    public usuarioRepository: IUsuarioRepository, 
    public turnoRecorridoRepository: ITurnoRecorridoRepository,
  ) { }

  tipoFormulario: number;
  areasSeleccionadasInitialState: any[] = [];
  turnoRecorridoFormInitialState: any = {
    nombre: '',
    operativo: null,
    horaInicio: '',
    horaFin: '',
    activo: true,
  };

  area: any;
  turnoRecorridoId: number;
  turnoRecorridoForm: FormGroup;
  operativos: any[] = [];
  areas: any[] = [];
  areasSeleccionadas: any[] = [];

  ngOnInit(): void {
    this.inicializarForm();
    if (this.tipoFormulario == 2) {
      this.listarDetalleTurnoRecorrido();
    }    
    this.inicializar();
  }

  async inicializar() {
    this.operativos = await this.listarOperativos();
    this.areas = await this.listarAreas();
    if (this.tipoFormulario == 2) {
      var data = await this.listarDetalleTurnoRecorrido();
      this.turnoRecorridoFormInitialState = {
        nombre: data.nombre, 
        operativo: this.operativos.find(operativo => operativo.id == data.operativo.id), 
        horaInicio: data.horaInicio, 
        horaFin: data.horaFin, 
        activo: data.activo
      };
      this.areasSeleccionadas = this.areas.filter(area => data.areas.findIndex(area2 => area2.id == area.id) > -1);
      this.areasSeleccionadasInitialState = [...this.areasSeleccionadas];
      this.inicializarForm();
    }     
  }

  inicializarForm(): void {
    this.turnoRecorridoForm = new FormGroup({
      nombre: new FormControl(this.turnoRecorridoFormInitialState.nombre, Validators.required),
      operativo: new FormControl(this.turnoRecorridoFormInitialState.operativo, Validators.required),
      horaInicio: new FormControl(this.turnoRecorridoFormInitialState.horaInicio, Validators.required),
      horaFin: new FormControl(this.turnoRecorridoFormInitialState.horaFin, Validators.required),
      activo: new FormControl(this.turnoRecorridoFormInitialState.activo),
    }, this.formValidator.bind(this));
  }

  listarOperativos() {
    return this.usuarioRepository.listarOperativosDeUTD().pipe(take(1)).toPromise();
  }

  listarAreas(){
    return this.areaRepository.listarAreasDeUTD(false).pipe(take(1)).toPromise();
  }

  agregarArea(area: any) {
    if (area) {
      if (this.areasSeleccionadas.findIndex(areaSeleccionada => areaSeleccionada == area) == -1) {
        this.areasSeleccionadas.push(area);
        this.turnoRecorridoForm.updateValueAndValidity();
      }else{
        alert('No puedes agregar un área que ya está en la lista');
      }      
    }
    this.area = null;
  }

  listarDetalleTurnoRecorrido() {
    return this.turnoRecorridoRepository.listarDetalleTurnoRecorrido(this.turnoRecorridoId).pipe(take(1)).toPromise();
  }

  removerArea(area:any) {
    this.areasSeleccionadas.splice(this.areasSeleccionadas.findIndex(areaSeleccionada => areaSeleccionada == area), 1);
    this.turnoRecorridoForm.updateValueAndValidity();
  }

  cerrar() {
    this.bsModalRef.hide();
  }

  private formValidator(form: FormGroup): ValidationErrors | null {
    if (this.areasSeleccionadas.length == 0) {
      return {
        noAreas: true
      }
    }
    if ( JSON.stringify(this.turnoRecorridoFormInitialState) ==  JSON.stringify(this.turnoRecorridoForm.value)){
      if (JSON.stringify(this.areasSeleccionadasInitialState) == JSON.stringify(this.areasSeleccionadas)) {
        return {
          noCambio: true
        }
      }
    } 
    return null;    
  }

  submit(value: any){
    value.areas = this.areasSeleccionadas;
    if (this.tipoFormulario == 1) {
      this.turnoRecorridoRepository.registrarTurnoRecorrido(value).pipe(take(1)).subscribe(data => {
        if (data.status == "success") {
          alert("Turno Recorrido creado");
          this.bsModalRef.hide();
        }
      });
    }else{
      this.turnoRecorridoRepository.editarTurnoRecorrido(this.turnoRecorridoId, value).pipe(take(1)).subscribe(data => {
        if (data.status == "success") {
          alert("Turno Recorrido actualizado");
          this.bsModalRef.hide();
        }
      });
    }
    
  }








  /** 
   * Drag n Drop
   */

  onDragged( item:any, list:any[], effect: DropEffect ) {

    if( effect === "move" ) {

      const index = list.indexOf( item );
      list.splice( index, 1 );
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

  

}
