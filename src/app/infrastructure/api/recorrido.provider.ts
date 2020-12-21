import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { IRecorridoRepository } from 'src/app/core/repository/recorrido.repository';
import { UtilsService } from 'src/app/utils/utils';


@Injectable()
export class RecorridoProvider extends IRecorridoRepository {
    
    constructor(
        private client: RequesterService,
        private utils: UtilsService
    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    
    listarReporteRecorridos(desde: string, hasta: string): Observable<any> {
        return this.client.get(this.prefix + "/recorridos", {
            params: new HttpParams()
            .set("desde", desde )
            .set("hasta", hasta )
        });
    }

}