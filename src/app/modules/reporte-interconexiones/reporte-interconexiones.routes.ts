import { Routes, RouterModule } from '@angular/router';
import { ReporteInterconexionesComponent } from './reporte-interconexiones.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: ReporteInterconexionesComponent,
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);