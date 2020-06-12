import { Routes, RouterModule } from '@angular/router';
import { InterconexionesComponent } from './interconexiones.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: InterconexionesComponent
    }
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);