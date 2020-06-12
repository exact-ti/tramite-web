import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalomaresComponent } from './palomares.component';
import { PalomarModalComponent } from './palomar-modal/palomar-modal.component';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DndModule } from 'ngx-drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTING } from './palomares.routes';



@NgModule({
  declarations: [PalomaresComponent, PalomarModalComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
    SharedModule,
    NgSelectModule,
    Ng2SmartTableModule,
    DndModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PalomaresModule { }
