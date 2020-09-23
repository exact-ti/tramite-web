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
import { UtilsService } from 'src/app/utils/utils';



@Injectable()
export class EnvioProvider extends IEnvioRepository {
    
      
       
    
    constructor(
        private client: RequesterService,
        private buzonRepository: IBuzonRepository,
        private utils: UtilsService,
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

    listarPorEtapasYRangoDeFechasDelBuzon(filtro: string, etapasIds: number[], desde: string, hasta: string): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.get(this.prefix + "/buzones/" + buzon.id.toString() + "/envios/" + filtro.toLowerCase(), {
            params: new HttpParams()
            .set("etapasIds", etapasIds.join(","))
            .set("desde", this.utils.parseDate(desde))
            .set("hasta", this.utils.parseDate(hasta))
        })));
    }

    listarReporteGeneral(desde: string, hasta: string, estadosIds: number[], origenesIds: number[], destinosIds: number[]): Observable<any> {
        return this.client.get(this.prefix + "/envios", {
            params: new HttpParams()
            .set("estadosIds", estadosIds.join(","))
            .set("origenesIds", origenesIds.join(","))
            .set("destinosIds", destinosIds.join(","))
            .set("desde", this.utils.parseDate(desde))
            .set("hasta", this.utils.parseDate(hasta))
        });
    }

    listarEnviosRetiradosPorRangoDeFechas(desde: string, hasta: string): Observable<any> {
        return this.client.get(this.prefix + "/envios/retirados", {
            params: new HttpParams()
            .set("desde", this.utils.parseDate(desde))
            .set("hasta", this.utils.parseDate(hasta))
        });
    }


}
