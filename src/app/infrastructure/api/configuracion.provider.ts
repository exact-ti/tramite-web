import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { map } from 'rxjs/operators';
import { IConfiguracionRepository } from 'src/app/core/repository/configuracion.repository';
import { Configuracion } from 'src/app/core/model/configuracion.model';
import { ErrorHandle } from 'src/app/utils/error-handle';

@Injectable()
export class ConfiguracionProvider extends IConfiguracionRepository {
    
    constructor(
        private client: RequesterService, 
        ) {
        super();
    }

    private configuraciones: Configuracion[];

    private prefix: string = "/servicio-tramite";

    listarConfiguracion(clave: string): Observable<Configuracion> {
        if (!this.configuraciones) {
            return this.client.get(this.prefix + "/configuraciones").pipe(map(data => {
                this.configuraciones = data.map((element) => new Configuracion(element.id, element.clave, element.valor));
                return this.listarConfiguracionDeLocal(clave);
            }));
        }else{
            return of(this.listarConfiguracionDeLocal(clave));
        }
    }

    listarConfiguracionDeLocal(clave: string): Configuracion {
        return this.configuraciones.find(configuracion => configuracion.clave === clave)
    }

    


}
