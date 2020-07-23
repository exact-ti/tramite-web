import { Routes, RouterModule } from '@angular/router';
import { PrincipalComponent } from './principal.component';
import { DefaultPageGuard } from 'src/app/guard/default-page-guard';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: PrincipalComponent,
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);