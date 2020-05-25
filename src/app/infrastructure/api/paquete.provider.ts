import { Injectable } from "@angular/core";
import { IPaqueteRepository } from 'src/app/core/repository/paquete.repository';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class PaqueteProvider extends IPaqueteRepository{

    constructor(
        private client: RequesterService
    ){
        super();
    }

    private prefix: string = "/servicio-tramite"

    verificarSiEsParaUso(tipoPaqueteId: number, paqueteId: string): Observable<boolean> {
        return this.client.get(this.prefix + "/tipospaquetes/" + tipoPaqueteId.toString() + "/paquetes/parauso", {
            params: new HttpParams().set("codigo", paqueteId)
        });
    }

}