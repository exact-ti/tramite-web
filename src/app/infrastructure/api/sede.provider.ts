import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import { flatMap, map } from 'rxjs/operators';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Utd } from 'src/app/core/model/utd.model';
import { ISedeRepository } from 'src/app/core/repository/sede.repository';
import { Sede } from 'src/app/core/model/sede.model';

@Injectable()
export class SedeProvider extends ISedeRepository{


    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    private myBool: boolean = true;

    private sedesSaved: Sede[];

    listarSedes(): Observable<any> {
            return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" +utd.id.toString() + "/sedes").pipe(map((response: any) => {                
                this.sedesSaved = response.map((element)=> new Sede(element.id, element.descripcion));
                return this.sedesSaved;
            }))));
    } 
    
    listarSedesSave(): Sede[] {
        return this.sedesSaved;
    }



}