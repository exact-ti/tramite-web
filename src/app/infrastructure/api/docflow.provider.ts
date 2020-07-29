import { IDocflowRepository } from 'src/app/core/repository/docflow.repository';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DocflowProvider extends IDocflowRepository{
    
    
    constructor(
        private client: RequesterService
    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    
    listarParametrosIngreso(): Observable<any> {
        return this.client.get(this.prefix + "/docflow/ingreso");
    }

    listarIndicadores(): Observable<any> {
        return this.client.get(this.prefix + "/docflow/indicadores");
    }

    listarParametrosIndicadorDetalle(status: string): Observable<any> {
        return this.client.get(this.prefix + "/docflow/indicadores/" + status + "/detalle");
    }
    
}