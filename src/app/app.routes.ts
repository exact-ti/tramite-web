import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const APP_ROUTES: Routes = [

    {
        path: 'generar-envio',
        loadChildren: './modules/registro-envio/registro-envio.module#RegistroEnvioModule'
    },
    {
        path: 'envios-activos',
        loadChildren: './modules/envios-activos/envios-activos.module#EnviosActivosModule'
    },
    {
        path: 'recepcion',
        loadChildren: './modules/confirmacion-envios/confirmacion-envios.module#ConfirmacionEnviosModule'
    },
    {
        path: '**',
        pathMatch: 'prefix',
        redirectTo: 'envios-activos'
    },
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);