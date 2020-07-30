import { ITipoPaqueteRepository } from 'src/app/core/repository/tipo-paquete.repository';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class TipoPaqueteProvider extends ITipoPaqueteRepository{
    

    constructor(
        private client: RequesterService,

    ){
        super();
    }
    
    private prefix: string = "/servicio-tramite";
    
    listarTiposPaquetes(interno: boolean, incluirInactivos: boolean): Observable<any> {
        return this.client.get(this.prefix + "/tipospaquetes",{
            params: new HttpParams()
            .set("interno", String(interno))
            .set("mostrarInactivos", String(incluirInactivos))
        });
    }

    registrarTipoPaquete(tipoPaquete: any): Observable<any> {
        return this.client.post(this.prefix + "/tipospaquetes", {
            interno: false,
            ...tipoPaquete
        });
    }
    actualizarTipoPaquete(id: number, tipoPaquete: any): Observable<any> {
        return this.client.put(this.prefix + "/tipospaquetes/" + id.toString(), {
            interno: false,
            ...tipoPaquete
        })
    }
    
}