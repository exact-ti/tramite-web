import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import { flatMap, map } from 'rxjs/operators';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Utd } from 'src/app/core/model/utd.model';
import { IPalomarRepository } from 'src/app/core/repository/palomar.repository';
import { TipoPalomarEnum } from 'src/app/enum/tipoPalomar.enum';
import { Palomar } from 'src/app/core/model/palomar.model';

@Injectable()
export class PalomarProvider extends IPalomarRepository{


    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    private myBool: boolean = true;
    private palomaresSaved: Palomar[];

    listarPalomares(): Observable<any> {
        if (!this.palomaresSaved) {
            return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" +utd.id.toString() + "/tipospalomares/" + TipoPalomarEnum.AREA +"/palomares").pipe(map((response: any) => {                
                this.palomaresSaved = response.map((element)=> new Palomar(element.id, element.descripcion));
                return this.palomaresSaved;
            }))));

        }else{
            return of(this.palomaresSaved);
        }
    }


    listarPalomaresSave(): Palomar[] {
        return this.palomaresSaved;
    }

}