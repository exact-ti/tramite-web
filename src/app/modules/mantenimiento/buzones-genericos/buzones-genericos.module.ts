import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuzonesGenericosComponent } from './buzones-genericos.component';
import { ModalComponent } from './modal/modal.component';
import { APP_ROUTING } from './buzones-genericos.routes';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { DndModule } from 'ngx-drag-drop';



@NgModule({
  declarations: [BuzonesGenericosComponent, ModalComponent],
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
export class BuzonesGenericosModule { }
