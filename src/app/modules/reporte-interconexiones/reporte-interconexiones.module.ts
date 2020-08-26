import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteInterconexionesComponent } from './reporte-interconexiones.component';
import { APP_ROUTING } from './reporte-interconexiones.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ReporteInterconexionesComponent
  ],
  imports: [
    SharedModule,
    APP_ROUTING,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    
  ]
})
export class ReporteInterconexionesModule { }
