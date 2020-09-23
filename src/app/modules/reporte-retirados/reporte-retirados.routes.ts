import { Routes, RouterModule } from '@angular/router';
import { ReporteRetiradosComponent } from './reporte-retirados.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: ReporteRetiradosComponent,
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);