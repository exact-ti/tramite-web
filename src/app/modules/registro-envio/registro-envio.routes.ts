import { Routes, RouterModule } from '@angular/router';
import { RegistroEnvioComponent } from './registro-envio.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: RegistroEnvioComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);