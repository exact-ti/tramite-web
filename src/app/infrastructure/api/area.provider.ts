import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import { IAreaRepository } from 'src/app/core/repository/area.repository';

@Injectable()
export class AreaProvider extends IAreaRepository{    

    constructor(
        private client: RequesterService
    ){
        super();
    }

    private prefix: string = "/servicio-tramite";

    verificarExistencia(areaId: string): Observable<boolean> {
        return this.client.get(this.prefix + "/areas", {
            params: new HttpParams().set("codigo", areaId)
        });
    }

}