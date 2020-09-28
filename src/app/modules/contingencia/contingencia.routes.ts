import { Routes, RouterModule } from '@angular/router';
import { ContingenciaComponent } from './contingencia.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: ContingenciaComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);