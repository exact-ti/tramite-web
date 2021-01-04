import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { IGrupoAgenciaRepository } from 'src/app/core/repository/grupo-agencia.repository';


@Injectable()
export class GrupoAgenciaProvider extends IGrupoAgenciaRepository{
    
    constructor(
        private client: RequesterService,
    ) {
        super();
    }

    private prefix: string = "/servicio-tramite";

    listarItemsPorTipoAgencia(tipoAgenciaId: number): Observable<any> {
        return this.client.get(`${this.prefix}/tiposagencias/${tipoAgenciaId}/gruposagencias/items`);
    }

   

}