import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteRetiradosComponent } from './reporte-retirados.component';
import { APP_ROUTING } from './reporte-retirados.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  declarations: [ReporteRetiradosComponent],
  imports: [
    APP_ROUTING,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
  ]
})
export class ReporteRetiradosModule { }
