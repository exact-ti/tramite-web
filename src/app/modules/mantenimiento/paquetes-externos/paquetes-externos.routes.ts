import { Routes, RouterModule } from '@angular/router';
import { PaquetesExternosComponent } from './paquetes-externos.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: PaquetesExternosComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);