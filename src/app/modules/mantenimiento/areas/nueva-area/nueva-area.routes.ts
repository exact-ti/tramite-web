import { Routes, RouterModule } from '@angular/router';
import { NuevaAreaComponent } from './nueva-area.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: NuevaAreaComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);