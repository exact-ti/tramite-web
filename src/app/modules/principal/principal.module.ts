import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './principal.component';
import { APP_ROUTING } from './principal.routes';



@NgModule({
  declarations: [PrincipalComponent],
  imports: [
    CommonModule,
    APP_ROUTING,
  ]
})
export class PrincipalModule { }
