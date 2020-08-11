import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaquetesExternosComponent } from './paquetes-externos.component';
import { APP_ROUTING } from './paquetes-externos.routes';
import { PaqueteExternoModalComponent } from './paquete-externo-modal/paquete-externo-modal.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [PaquetesExternosComponent, PaqueteExternoModalComponent],
  imports: [
    CommonModule, 
    APP_ROUTING,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PaquetesExternosModule { }
