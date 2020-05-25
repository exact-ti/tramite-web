import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnviosActivosComponent } from './envios-activos.component';
import { APP_ROUTING } from './envios-activos.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EnviosActivosComponent,
  ],
  imports: [
    CommonModule,
    APP_ROUTING,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class EnviosActivosModule { }
