import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent      
    },
    {
        path: 'home',
        loadChildren: './modules/principal/principal.module#PrincipalModule'
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
        path: 'envios-historicos',
        loadChildren: './modules/envios-historicos/envios-historicos.module#EnviosHistoricosModule'
    },
    {
        path: 'reporte-general',
        loadChildren: './modules/reporte-general/reporte-general.module#ReporteGeneralModule'
    },
    {
        path: 'reporte-interconexiones',
        loadChildren: './modules/reporte-interconexiones/reporte-interconexiones.module#ReporteInterconexionesModule'
    },
    {
        path: 'reporte-recorridos',
        loadChildren: './modules/reporte-recorridos/reporte-recorridos.module#ReporteRecorridosModule'
    },
    {
        path: '**',
        pathMatch: 'prefix',
        redirectTo: '',        
    },
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);