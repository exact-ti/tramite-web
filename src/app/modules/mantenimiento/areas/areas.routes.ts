import { Routes, RouterModule } from '@angular/router';
import { AreasComponent } from './areas.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: AreasComponent
    }
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);