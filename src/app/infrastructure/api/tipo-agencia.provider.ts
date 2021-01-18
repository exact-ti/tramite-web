import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { flatMap } from "rxjs/operators";
import { ITipoAgenciaRepository } from "src/app/core/repository/tipo-agencia.repository";
import { IUtdRepository } from "src/app/core/repository/utd.repository";
import { RequesterService } from "./core/requester.service";


@Injectable()
export class TipoAgenciaProvider extends ITipoAgenciaRepository {

    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository,

    ) {
        super();
    }

    private prefix: string = "/servicio-tramite";

    listarTiposAgenciasItemsDeLaUtd(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(`${this.prefix}/utds/${utd.id}/tiposagencias/items`)));
    }

}