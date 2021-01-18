import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { ITipoSedeRepository } from 'src/app/core/repository/tipo-sede.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { RequesterService } from './core/requester.service';



@Injectable()
export class TipoSedeProvider extends ITipoSedeRepository{
    
      

    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository,

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";


    listarTiposSedesDeLaUtd(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(`${this.prefix}/utds/${utd.id.toString()}/tipossedes/items`)));
    }

}