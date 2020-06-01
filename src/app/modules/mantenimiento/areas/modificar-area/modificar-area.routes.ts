import { Routes, RouterModule } from '@angular/router';
import { ModificarAreaComponent } from './modificar-area.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: ModificarAreaComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);