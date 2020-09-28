import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContingenciaComponent } from './contingencia.component';
import { APP_ROUTING } from './contingencia.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  declarations: [ContingenciaComponent],
  imports: [
    CommonModule, 
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2SmartTableModule,
  ]
})
export class ContingenciaModule { }
