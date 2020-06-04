import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasComponent } from './areas.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTING } from './areas.routes';
import { Ng2SmartTableModule } from 'ng2-smart-table';



@NgModule({
  declarations: [AreasComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule
  ]
})
export class AreasModule { }
