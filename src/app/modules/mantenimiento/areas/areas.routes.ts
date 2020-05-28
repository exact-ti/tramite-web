import { Routes, RouterModule } from '@angular/router';
import { AreasComponent } from './areas.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: AreasComponent
    },
    { 
        path: 'nuevo',
        loadChildren: './nueva-area/nueva-area.module#NuevaAreaModule'
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);