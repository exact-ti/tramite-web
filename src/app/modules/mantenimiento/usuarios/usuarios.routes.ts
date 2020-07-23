import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';

const APP_ROUTES: Routes = [
    { 
        path: '', 
        component: UsuariosComponent
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);