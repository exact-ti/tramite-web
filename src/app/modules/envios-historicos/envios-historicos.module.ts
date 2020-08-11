import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnviosHistoricosComponent } from './envios-historicos.component';
import { APP_ROUTING } from '../envios-historicos/envios-historicos.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [EnviosHistoricosComponent],
  imports: [
    CommonModule, 
    APP_ROUTING,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class EnviosHistoricosModule { }
