import { Routes, RouterModule } from '@angular/router';
import { PalomaresComponent } from './palomares.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: PalomaresComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);