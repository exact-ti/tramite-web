import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

import { BuzonCardComponent } from './buzon-card/buzon-card.component';
import { EnvioCardComponent } from './envio-card/envio-card.component';
import { TrackingComponent } from './modals/tracking/tracking.component';



@NgModule({
  declarations: [
    BuzonCardComponent,
    EnvioCardComponent,
    TrackingComponent
  ],
  imports: [
    CommonModule, 
    ModalModule.forRoot(),
  ],
  exports: [
    BuzonCardComponent, 
    EnvioCardComponent
  ], 
  providers: [
    BsModalService,
  ], 
  entryComponents: [
    TrackingComponent,
  ]
})
export class SharedModule { }
