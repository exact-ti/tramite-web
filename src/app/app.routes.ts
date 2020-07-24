import { Routes, RouterModule } from '@angular/router';
import { DefaultPageGuard } from './guard/default-page-guard';
import { HomeComponent } from './modules/home/home.component';

const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent      
        //canActivate: [DefaultPageGuard]
    },
    {
        path: 'envios-activos',
        loadChildren: './modules/envios-activos/envios-activos.module#EnviosActivosModule'
    },
    {
        path: 'generar-envio',
        loadChildren: './modules/registro-envio/registro-envio.module#RegistroEnvioModule'
    },
    {
        path: 'confirmar-envios',
        loadChildren: './modules/confirmacion-envios/confirmacion-envios.module#ConfirmacionEnviosModule'
    },
    {
        path: 'mantenimientos',
        loadChildren: './modules/mantenimiento/mantenimiento.module#MantenimientoModule'
    },
    {
        path: 'dashboard',
        loadChildren: './modules/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'home',
        loadChildren: './modules/principal/principal.module#PrincipalModule'
    },
    {
        path: '**',
        pathMatch: 'prefix',
        redirectTo: '',        
        //canActivate: [DefaultPageGuard]
    },
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);