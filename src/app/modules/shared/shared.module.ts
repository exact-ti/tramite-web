import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";

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
import { CheckTreeViewComponent } from './check-tree-view/check-tree-view.component';
import { DetalleErrorComponent } from './modals/detalle-error/detalle-error.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

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
    CheckTreeViewComponent,
    DetalleErrorComponent,
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    NgSelectModule,
    FormsModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    Ng2SmartTableModule,
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
    CheckTreeViewComponent,
  ],
  providers: [
    BsModalService,
    CustomDatePipe,
  ],
  entryComponents: [
    TrackingComponent,
    ConfirmModalComponent, 
    DetalleErrorComponent,
  ]
})
export class SharedModule { }
