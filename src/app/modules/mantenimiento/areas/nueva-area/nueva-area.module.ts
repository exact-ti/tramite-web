import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevaAreaComponent } from './nueva-area.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';




@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule
  ]
})
export class NuevaAreaModule { }
