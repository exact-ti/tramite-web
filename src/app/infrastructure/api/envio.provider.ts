import { IEnvioRepository } from 'src/app/core/repository/envio.repository';
import { Injectable } from '@angular/core';
import { RequesterService } from './core/requester.service';
import { Observable } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { flatMap } from 'rxjs/operators';
import { Buzon } from 'src/app/core/model/buzon.model';
import { Envio } from 'src/app/core/model/envio.model';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';


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

    listarActivosDelBuzon(filtro: string, etapasIds: number[]): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.get(this.prefix + "/buzones/" + buzon.id.toString() + "/envios/" + filtro.toLowerCase(), {
            params: new HttpParams().set("etapasIds", etapasIds.join(","))
        })));
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

    listarPorEtapasYRangoDeFechasDelBuzon(filtro: string, etapasIds: number[], desde: Date, hasta: Date): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.get(this.prefix + "/buzones/" + buzon.id.toString() + "/envios/" + filtro.toLowerCase(), {
            params: new HttpParams()
            .set("etapasIds", etapasIds.join(","))
            .set("desde", moment(desde).format("d/MM/yyyy"))
            .set("hasta", moment(hasta).format("d/MM/yyyy"))
        })));
    }

    listarReporteGeneral(desde: Date, hasta: Date, estadosIds: number[], origenesIds: number[], destinosIds: number[]): Observable<any> {
        return this.client.get(this.prefix + "/envios", {
            params: new HttpParams()
            .set("estadosIds", estadosIds.join(","))
            .set("origenesIds", origenesIds.join(","))
            .set("destinosIds", destinosIds.join(","))
            .set("desde", moment(desde).format("d/MM/yyyy"))
            .set("hasta", moment(hasta).format("d/MM/yyyy"))
        });
    }


}
