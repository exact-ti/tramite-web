import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteGeneralComponent } from './reporte-general.component';
import { APP_ROUTING } from './reporte-general.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  declarations: [ReporteGeneralComponent],
  imports: [
    CommonModule, 
    APP_ROUTING,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    Ng2SmartTableModule,
  ]
})
export class ReporteGeneralModule { }
