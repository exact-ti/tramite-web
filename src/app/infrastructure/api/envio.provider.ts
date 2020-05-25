import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { Injectable } from '@angular/core';
import { RequesterService } from './core/requester.service';
import { Observable } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { flatMap } from 'rxjs/operators';
import { Buzon } from 'src/app/core/model/buzon.model';
import { Envio } from 'src/app/core/model/envio.model';


@Injectable()
export class EnvioProvider extends IEnvioRepository {
       
    
    constructor(
        private client: RequesterService,
        private buzonRepository: IBuzonRepository
    ) {
        super();
    }

    private prefix: string = "/servicio-tramite";

    enviar(envio: any): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.post(this.prefix + "/envios", {
            remitenteId: buzon.id,
            destinatarioId: envio.destinatario.id,
            codigoUbicacion: envio.areaId, 
            codigoPaquete: envio.paqueteId,
            observacion: envio.observacion,
        })));
        
    }

    listarActivosDelBuzon(filtro: string): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.get(this.prefix + "/buzones/" + buzon.id.toString() + "/envios/activos/" + filtro.toLowerCase())));
    }

    listarPorConfirmarDelBuzon(): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.get(this.prefix + "/buzones/" + buzon.id.toString() + "/envios/confirmacion")));
    }

    confirmarEnvios(paquetesIds: string[]): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.post(this.prefix + "/buzones/" + buzon.id.toString() + "/envios/confirmacion", paquetesIds)));
    }

    listarDetalle(envioId: number): Observable<any> {
        return this.client.get(this.prefix + "/envios/" + envioId.toString() + "/detalle");
    }
    listarSeguimientos(envioId: number): Observable<any> {
        return this.client.get(this.prefix + "/envios/" + envioId.toString() + "/seguimientos");
    } 

}
