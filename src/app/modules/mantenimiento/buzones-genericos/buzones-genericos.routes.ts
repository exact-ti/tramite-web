import { Routes, RouterModule } from '@angular/router';
import { BuzonesGenericosComponent } from './buzones-genericos.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: BuzonesGenericosComponent
    }
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);