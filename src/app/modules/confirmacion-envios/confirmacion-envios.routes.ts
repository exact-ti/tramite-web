import { Routes, RouterModule } from '@angular/router';
import { ConfirmacionEnviosComponent } from './confirmacion-envios.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: ConfirmacionEnviosComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);