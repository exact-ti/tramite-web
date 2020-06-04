import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { APP_ROUTING } from './app.routes';
import { RegistroEnvioModule } from './modules/registro-envio/registro-envio.module';
import { EnviosActivosModule } from './modules/envios-activos/envios-activos.module';
import { ConfirmacionEnviosModule } from './modules/confirmacion-envios/confirmacion-envios.module';
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
import { MantenimientoModule } from './modules/mantenimiento/mantenimiento.module';
import { AreasModule } from './modules/mantenimiento/areas/areas.module';
import { IUtdRepository } from './core/repository/utd.repository';
import { UtdProvider } from './infrastructure/api/utd.provider';
import { NuevaAreaComponent } from './modules/mantenimiento/areas/nueva-area/nueva-area.component';
import { ModificarAreaComponent } from './modules/mantenimiento/areas/modificar-area/modificar-area.component';
import { IPalomarRepository } from './core/repository/palomar.repository';
import { PalomarProvider } from './infrastructure/api/palomar.provider';
import { ISedeRepository } from './core/repository/sede.repository';
import { SedeProvider } from './infrastructure/api/sede.provider';
import { UtilsService } from './utils/utils';
import { NotifierModule } from 'angular-notifier';
import { TurnosRecorridosModule } from './modules/mantenimiento/turnos-recorridos/turnos-recorridos.module';
import { ITurnoRecorridoRepository } from './core/repository/turno-recorrido.repository';
import { TurnoRecorridoProvider } from './infrastructure/api/turno-recorrido.provider';
import { IUsuarioRepository } from './core/repository/usuario.repository';
import { UsuarioProvider } from './infrastructure/api/usuario.provider';

export function cargarConfiguracion(httpClient: HttpClient) {
  return () => httpClient.get('/assets/config.json').pipe(take(1)).pipe(
      map((x: any) => {
        let modo: string = x.mode;
        let objeto: any = x[modo];
        AppConfig.Inicializar(objeto.login_url, objeto.api);
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
    ModificarAreaComponent,
  ],
  imports: [
    NotifierModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RegistroEnvioModule,
    EnviosActivosModule,
    ConfirmacionEnviosModule,
    TurnosRecorridosModule,
    APP_ROUTING,
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

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA],

})
export class AppModule { }
