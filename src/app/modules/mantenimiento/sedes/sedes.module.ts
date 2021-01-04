import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SedesComponent } from './sedes.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { APP_ROUTING } from './sedes.routes';
import { SedeModalComponent } from './sede-modal/sede-modal.component';



@NgModule({
  declarations: [SedesComponent, SedeModalComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
  ]
})
export class SedesModule { }
