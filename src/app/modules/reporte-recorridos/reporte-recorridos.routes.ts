import { Routes, RouterModule } from '@angular/router';
import { ReporteRecorridosComponent } from './reporte-recorridos.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: ReporteRecorridosComponent,
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);