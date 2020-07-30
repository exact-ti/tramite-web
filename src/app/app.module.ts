import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { APP_ROUTING } from './app.routes';
import { LocalStorageService } from './infrastructure/storage/local-storage.service';
import { LocalStorage } from './core/repository/local-storage'
import { AppConfig } from './app.config';
import { IMenuRepository } from './core/repository/menu.repository';
import { MenuProvider } from './infrastructure/api/menu.provider';
import { RequesterService } from './infrastructure/api/core/requester.service';
import { Interceptor } from './infrastructure/api/core/interceptor';
import { SideBarComponent } from './layout/side-bar/side-bar.component';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { TreeViewComponent } from './layout/side-bar/tree-view/tree-view.component';
import { ErrorHandle } from './utils/error-handle';
import { IBuzonRepository } from './core/repository/buzon.repository';
import { BuzonProvider } from './infrastructure/api/buzon.provider';
import { IConfiguracionRepository } from './core/repository/configuracion.repository';
import { ConfiguracionProvider } from './infrastructure/api/configuracion.provider';
import { IPaqueteRepository } from './core/repository/paquete.repository';
import { PaqueteProvider } from './infrastructure/api/paquete.provider';
import { IAreaRepository } from './core/repository/area.repository';
import { AreaProvider } from './infrastructure/api/area.provider';
import { IEnvioRepository } from './core/repository/envio.repository';
import { EnvioProvider } from './infrastructure/api/envio.provider';
import { IUtdRepository } from './core/repository/utd.repository';
import { UtdProvider } from './infrastructure/api/utd.provider';
import { NuevaAreaComponent } from './modules/mantenimiento/areas/nueva-area/nueva-area.component';
import { IPalomarRepository } from './core/repository/palomar.repository';
import { PalomarProvider } from './infrastructure/api/palomar.provider';
import { ISedeRepository } from './core/repository/sede.repository';
import { SedeProvider } from './infrastructure/api/sede.provider';
import { UtilsService } from './utils/utils';
import { NotifierModule } from 'angular-notifier';
import { ITurnoRecorridoRepository } from './core/repository/turno-recorrido.repository';
import { TurnoRecorridoProvider } from './infrastructure/api/turno-recorrido.provider';
import { IUsuarioRepository } from './core/repository/usuario.repository';
import { UsuarioProvider } from './infrastructure/api/usuario.provider';
import { InterconexionProvider } from './infrastructure/api/interconexion.provider';
import { IInterconexionRepository } from './core/repository/interconexion.repository';
import { ModificarBuzonUtdComponent } from './layout/top-bar/modificar-buzon-utd/modificar-buzon-utd.component';
import { PerfilProvider } from './infrastructure/api/perfil.provider';
import { IPerfilRepository } from './core/repository/perfil.repository';
import { IDashboardRepository } from './core/repository/dashboard.repository';
import { DashboardProvider } from './infrastructure/api/dashboard.provider';
import { SharedModule } from './modules/shared/shared.module';
import { HomeComponent } from './modules/home/home.component';
import { IDocflowRepository } from './core/repository/docflow.repository';
import { DocflowProvider } from './infrastructure/api/docflow.provider';
import { SubmitForm } from './utils/submit-form';
import { IEstadoEnvioRepository } from './core/repository/estado-envio.repository';
import { EstadoEnvioProvider } from './infrastructure/api/estado-envio.provider';
import { IEtapaEnvioRepository } from './core/repository/etapa-envio.repository';
import { EtapaEnvioProvider } from './infrastructure/api/etapa-envio.provider';

export function cargarConfiguracion(httpClient: HttpClient) {
  return () => httpClient.get('/assets/config.json').pipe(take(1)).pipe(
      map((x: any) => {
        let modo: string = x.mode;
        let objeto: any = x[modo]; 
        AppConfig.Inicializar(objeto.login_url, objeto.api, objeto.integracion_docflow);
      })
  ).subscribe();
}

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    TopBarComponent,
    TreeViewComponent,
    NuevaAreaComponent,
    ModificarBuzonUtdComponent,
    HomeComponent,
  ],
  imports: [
    APP_ROUTING,
    NotifierModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    RequesterService,
    {
      provide: APP_INITIALIZER,
      useFactory: cargarConfiguracion,
      multi: true,
      deps: [HttpClient]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    {provide: LocalStorage, useClass: LocalStorageService},
    {provide: IMenuRepository, useClass: MenuProvider},
    {provide: IBuzonRepository, useClass: BuzonProvider},
    ErrorHandle,
    UtilsService,
    {provide: IConfiguracionRepository, useClass: ConfiguracionProvider},
    {provide: IPaqueteRepository, useClass: PaqueteProvider},
    {provide: IAreaRepository, useClass: AreaProvider},
    {provide: IEnvioRepository, useClass: EnvioProvider},
    {provide: IUtdRepository, useClass: UtdProvider},
    {provide: IPalomarRepository, useClass: PalomarProvider},
    {provide: ISedeRepository, useClass: SedeProvider},
    {provide: ITurnoRecorridoRepository, useClass: TurnoRecorridoProvider},
    {provide: IUsuarioRepository, useClass: UsuarioProvider},
    {provide: IInterconexionRepository, useClass: InterconexionProvider},
    {provide: IPerfilRepository, useClass: PerfilProvider},
    {provide: IDashboardRepository, useClass: DashboardProvider},
    {provide: IDocflowRepository, useClass: DocflowProvider},
    {provide: IEstadoEnvioRepository, useClass: EstadoEnvioProvider},
    {provide: IEtapaEnvioRepository, useClass: EtapaEnvioProvider},
    SubmitForm,
  ],
  bootstrap: [AppComponent],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA],

})
export class AppModule { }
