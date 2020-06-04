import { Routes, RouterModule } from '@angular/router';
import { TurnosRecorridosComponent } from './turnos-recorridos.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: TurnosRecorridosComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);