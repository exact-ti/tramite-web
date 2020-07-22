import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: DashboardComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);