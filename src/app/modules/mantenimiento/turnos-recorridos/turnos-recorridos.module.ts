import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosRecorridosComponent } from './turnos-recorridos.component';
import { APP_ROUTING } from './turnos-recorridos.routes';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TurnoRecorridoComponent } from './modal/turno-recorrido/turno-recorrido.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DndModule } from "ngx-drag-drop";
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [TurnosRecorridosComponent, TurnoRecorridoComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DndModule,
    SharedModule,
  ]
})
export class TurnosRecorridosModule { }
