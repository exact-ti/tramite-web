import { Injectable } from '@angular/core';
import { IEstadoEnvioRepository } from 'src/app/core/repository/estado-envio.repository';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class EstadoEnvioProvider extends IEstadoEnvioRepository{
    

    constructor(
        private client: RequesterService,
    ) {
        super();
    }

    private prefix: string = "/servicio-tramite";

    listar(incluirHistoricos: boolean): Observable<any> {
        return this.client.get(this.prefix + "/estadosenvios", {
            params: new HttpParams().set("incluirHistoricos", String(incluirHistoricos))
        });
    }

}