import { Routes, RouterModule } from '@angular/router';
import { SedesComponent } from './sedes.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: SedesComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);