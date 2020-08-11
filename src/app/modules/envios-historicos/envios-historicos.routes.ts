import { Routes, RouterModule } from '@angular/router';
import { EnviosHistoricosComponent } from './envios-historicos.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: EnviosHistoricosComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);