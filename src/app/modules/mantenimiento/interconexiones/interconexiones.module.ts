import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterconexionesComponent } from './interconexiones.component';
import { InterconexionModalComponent } from './interconexion-modal/interconexion-modal.component';



@NgModule({
  declarations: [InterconexionesComponent, InterconexionModalComponent],
  imports: [
    CommonModule
  ]
})
export class InterconexionesModule { }
