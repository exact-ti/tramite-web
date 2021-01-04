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

    listarSedesDeUTD(): Observable<any> {
            return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" +utd.id.toString() + "/sedes")));
    } 

    listarItemsSedesDeUtdPorTipoSede(tipoSedeId: number): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" +utd.id.toString() + "/tipossedes/" + tipoSedeId.toString() + "/sedes").pipe(map((response: any) => {                
            return response.data.map((element)=> new Sede(element.id, element.descripcion));
        }))));
    }


    listarDetalleDeSede(id: number): Observable<any> {
        return this.client.get(`${this.prefix}/sedes/${id}/detalle`);
    }

    registrarSede(sede: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.post(this.prefix + "/utds/" +utd.id.toString() + "/sedes", this.transformar(sede))));
    }

    actualizarSede(sedeId: number, sede: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.put(`${this.prefix}/utds/${utd.id.toString()}/sedes/${sedeId}`, this.transformar(sede))));
    }


    private transformar(sede: any) {
        return {
            codigo: sede.codigo,
            nombre: sede.nombre,
            tipoSedeId: sede.tipoSede.id,
            tipoAgenciaId: sede.tipoAgencia?.id,
            grupoAgenciaId: sede.grupoAgencia?.id,
            activo: sede.activo,
        }
    }
    
}