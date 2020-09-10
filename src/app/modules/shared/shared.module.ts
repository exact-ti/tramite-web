import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { BuzonCardComponent } from './buzon-card/buzon-card.component';
import { EnvioCardComponent } from './envio-card/envio-card.component';
import { TrackingComponent } from './modals/tracking/tracking.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { ButtonViewComponent } from './button-view/button-view.component';
import { AreaCardComponent } from './area-card/area-card.component';
import { TurnoCardComponent } from './turno-card/turno-card.component';
import { UtdCardComponent } from './utd-card/utd-card.component';
import { UsuarioCardComponent } from './usuario-card/usuario-card.component';
import { TabsComponent } from './tabs/tabs.component';
import { CargoComponent } from './modals/cargo/cargo.component';
import { ExportComponent } from './export/export.component';
import { ValidInputComponent } from './valid-input/valid-input.component';
import { ValidSelectComponent } from './valid-select/valid-select.component';
import { ActivoSwitchComponent } from './activo-switch/activo-switch.component';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';

@NgModule({
  declarations: [
    BuzonCardComponent,
    EnvioCardComponent,
    TrackingComponent,
    ConfirmModalComponent,
    ButtonViewComponent,
    AreaCardComponent,
    TurnoCardComponent,
    UtdCardComponent,
    UsuarioCardComponent,
    TabsComponent,
    CargoComponent,
    ExportComponent,
    ValidInputComponent,
    ValidSelectComponent,
    ActivoSwitchComponent,
    CustomDatePipe,
  ],
  imports: [
    CommonModule, 
    ModalModule.forRoot(),
    NgSelectModule,
    FormsModule,
  ],
  exports: [
    BuzonCardComponent, 
    EnvioCardComponent,
    ButtonViewComponent,
    AreaCardComponent,
    TurnoCardComponent,
    UtdCardComponent,
    UsuarioCardComponent, 
    TabsComponent,
    ExportComponent,
    ValidInputComponent,
    ValidSelectComponent,
    ActivoSwitchComponent,
    CustomDatePipe,
  ], 
  providers: [
    BsModalService,
    CustomDatePipe,
  ], 
  entryComponents: [
    TrackingComponent,
    ConfirmModalComponent
  ]
})
export class SharedModule { }
