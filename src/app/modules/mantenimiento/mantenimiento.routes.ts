import { Routes, RouterModule } from '@angular/router';

const APP_ROUTES: Routes = [
    { 
        path: 'turnos-recorridos',
        loadChildren: './turnos-recorridos/turnos-recorridos.module#TurnosRecorridosModule'
    },
    { 
        path: 'areas',
        loadChildren: './areas/areas.module#AreasModule'
    },
    { 
        path: 'interconexiones',
        loadChildren: './interconexiones/interconexiones.module#InterconexionesModule'
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);