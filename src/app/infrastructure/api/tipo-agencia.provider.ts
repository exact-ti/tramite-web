import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ITipoAgenciaRepository } from "src/app/core/repository/tipo-agencia.repository";
import { RequesterService } from "./core/requester.service";


@Injectable()
export class TipoAgenciaProvider extends ITipoAgenciaRepository{
    
    constructor(
        private client: RequesterService,

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";


    
    listarTiposAgenciasItems(): Observable<any> {
        return this.client.get(`${this.prefix}/tiposagencias/items`);
    }

}