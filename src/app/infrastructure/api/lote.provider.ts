import { ILoteRepository } from 'src/app/core/repository/lote.repository';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';


@Injectable()
export class LoteProvider extends ILoteRepository {
    
    constructor(
        private client: RequesterService,
    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    
    listarReporteLotes(desde: Date, hasta: Date): Observable<any> {
        return this.client.get(this.prefix + "/lotes", {
            params: new HttpParams()
            .set("desde", moment(desde).format("d/MM/yyyy"))
            .set("hasta", moment(hasta).format("d/MM/yyyy"))
        });
    }

}