import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteRecorridosComponent } from './reporte-recorridos.component';
import { APP_ROUTING } from './reporte-recorridos.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  declarations: [ReporteRecorridosComponent],
  imports: [
    APP_ROUTING,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
  ]
})
export class ReporteRecorridosModule { }
