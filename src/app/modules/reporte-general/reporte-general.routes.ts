import { Routes, RouterModule } from '@angular/router';
import { ReporteGeneralComponent } from './reporte-general.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: ReporteGeneralComponent,
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);