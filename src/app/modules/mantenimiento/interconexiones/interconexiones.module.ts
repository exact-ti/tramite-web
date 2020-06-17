import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterconexionesComponent } from './interconexiones.component';
import { InterconexionModalComponent } from './interconexion-modal/interconexion-modal.component';
import { APP_ROUTING } from './interconexiones.routes';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DndModule } from 'ngx-drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxTimePickerModule } from 'igniteui-angular';



@NgModule({
  declarations: [InterconexionesComponent, InterconexionModalComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
    SharedModule,
    NgSelectModule,
    Ng2SmartTableModule,
    DndModule,
    FormsModule,
    ReactiveFormsModule,
    IgxTimePickerModule
  ]
})
export class InterconexionesModule { }
