import { Routes, RouterModule } from '@angular/router';

const APP_ROUTES: Routes = [
    { 
        path: 'areas',
        loadChildren: './areas/areas.module#AreasModule'
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);