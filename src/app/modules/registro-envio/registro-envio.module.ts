import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroEnvioComponent } from './registro-envio.component';
import { APP_ROUTING } from './registro-envio.routes';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegistroEnvioComponent
  ],
  imports: [
    CommonModule,
    APP_ROUTING,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class RegistroEnvioModule { }
