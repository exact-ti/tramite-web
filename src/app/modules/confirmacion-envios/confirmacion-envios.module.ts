import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmacionEnviosComponent } from './confirmacion-envios.component';
import { APP_ROUTING } from './confirmacion-envios.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ConfirmacionEnviosComponent
  ],
  imports: [
    CommonModule,
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ConfirmacionEnviosModule { }
