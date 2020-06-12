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
    private palomaresSaved: Palomar[];
    private palomaresMantenimiento: Palomar[];

    listarDetallePalomar(id: string): Observable<any> {
        return this.client.get(this.prefix + "/palomares/" + id);
    }

    listarPalomares(): Observable<any> {
        if (!this.palomaresSaved) {
            return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" +utd.id.toString() + "/tipospalomares/" + TipoPalomarEnum.AREA +"/palomares").pipe(map((response: any) => {                
                this.palomaresSaved = response.map((element)=> new Palomar(element.id, element.descripcion,null,null,null,null));
                return this.palomaresSaved;
            }))));

        }else{
            return of(this.palomaresSaved);
        }
    }

    listarPalomaresPrincipal(): Observable<any> {
        if (!this.palomaresMantenimiento) {
            return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" +utd.id.toString() +"/palomares").pipe(map((response: any) => {                
                this.palomaresMantenimiento = response.map((element)=> new Palomar(element.id, element.descripcion,element.ubicacion,element.tipoPalomar,element.destino,element.activo));
                return this.palomaresMantenimiento;
            }))));

        }else{
            return of(this.palomaresMantenimiento);
        }
    }    

    listarPalomaresSave(): Palomar[] {
        return this.palomaresSaved;
    }

}