import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

import { BuzonCardComponent } from './buzon-card/buzon-card.component';
import { EnvioCardComponent } from './envio-card/envio-card.component';
import { TrackingComponent } from './modals/tracking/tracking.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { ButtonViewComponent } from './button-view/button-view.component';
import { AreaCardComponent } from './area-card/area-card.component';
import { TurnoCardComponent } from './turno-card/turno-card.component';



@NgModule({
  declarations: [
    BuzonCardComponent,
    EnvioCardComponent,
    TrackingComponent,
    ConfirmModalComponent,
    ButtonViewComponent,
    AreaCardComponent,
    TurnoCardComponent
  ],
  imports: [
    CommonModule, 
    ModalModule.forRoot(),
    
  ],
  exports: [
    BuzonCardComponent, 
    EnvioCardComponent,
    ButtonViewComponent,
    AreaCardComponent,
    TurnoCardComponent
  ], 
  providers: [
    BsModalService,
  ], 
  entryComponents: [
    TrackingComponent,
    ConfirmModalComponent
  ]
})
export class SharedModule { }
