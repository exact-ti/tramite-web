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
    { 
        path: 'palomares',
        loadChildren: './palomares/palomares.module#PalomaresModule'
    },
    { 
        path: 'usuarios',
        loadChildren: './usuarios/usuarios.module#UsuariosModule'
    },
    { 
        path: 'buzones-genericos',
        loadChildren: './buzones-genericos/buzones-genericos.module#BuzonesGenericosModule'
    },
    { 
        path: 'paquetes-externos',
        loadChildren: './paquetes-externos/paquetes-externos.module#PaquetesExternosModule'
    },
    { 
        path: 'perfiles',
        loadChildren: './perfiles/perfiles.module#PerfilesModule'
    },
    { 
        path: 'sedes',
        loadChildren: './sedes/sedes.module#SedesModule'
    },
];

export const APP_ROUTING = RouterModule.forChild(APP_ROUTES);