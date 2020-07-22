import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { ModalComponent } from './modal/modal.component';
import { APP_ROUTING } from './usuarios.routes';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DndModule } from 'ngx-drag-drop';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [UsuariosComponent, ModalComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DndModule,
    SharedModule,
  ]
})
export class UsuariosModule { }
