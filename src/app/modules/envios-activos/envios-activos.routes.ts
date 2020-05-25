import { Routes, RouterModule } from '@angular/router';
import { EnviosActivosComponent } from './envios-activos.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: EnviosActivosComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);