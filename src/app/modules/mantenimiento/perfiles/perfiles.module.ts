import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilesComponent } from './perfiles.component';
import { APP_ROUTING } from './perfiles.routes';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilModalComponent } from './perfil-modal/perfil-modal.component';
import {MatSliderModule} from '@angular/material/slider';



@NgModule({
  declarations: [PerfilesComponent, PerfilModalComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
    SharedModule,
    NgSelectModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
  ]
})
export class PerfilesModule { }
