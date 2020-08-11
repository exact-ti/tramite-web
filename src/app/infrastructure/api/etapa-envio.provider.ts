import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import { IEtapaEnvioRepository } from 'src/app/core/repository/etapa-envio.repository';


@Injectable()
export class EtapaEnvioProvider extends IEtapaEnvioRepository{
    

    constructor(
        private client: RequesterService,
    ) {
        super();
    }

    private prefix: string = "/servicio-tramite";

    listar(incluirHistoricos: boolean): Observable<any> {
        return this.client.get(this.prefix + "/etapasenvios", {
            params: new HttpParams().set("incluirHistoricos", String(incluirHistoricos))
        });
    }

}