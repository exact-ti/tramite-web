import { Routes, RouterModule } from '@angular/router';
import { PerfilesComponent } from './perfiles.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: PerfilesComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);