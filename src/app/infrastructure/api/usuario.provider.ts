import { ITurnoRecorridoRepository } from 'src/app/core/repository/turno-recorrido.repository';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { flatMap, map } from 'rxjs/operators';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';


@Injectable()
export class UsuarioProvider extends IUsuarioRepository{
    

    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository,

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";

    listarOperativosDeUTD(): Observable<any[]> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/usuarios")));
    }

}