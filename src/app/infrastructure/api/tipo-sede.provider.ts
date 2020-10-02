import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITipoSedeRepository } from 'src/app/core/repository/tipo-sede.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { RequesterService } from './core/requester.service';



@Injectable()
export class TipoSedeProvider extends ITipoSedeRepository{
      

    constructor(
        private client: RequesterService,

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";

    
    listarTiposSedes(): Observable<any> {
        return this.client.get(this.prefix + "/tipossedes/items");
    }

}