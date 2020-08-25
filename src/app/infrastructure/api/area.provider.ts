import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { flatMap } from 'rxjs/operators';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Utd } from 'src/app/core/model/utd.model';

@Injectable()
export class AreaProvider extends IAreaRepository{
            

    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    private myBool: boolean = true;

    verificarExistencia(areaId: string): Observable<boolean> {
        return this.client.get(this.prefix + "/areas", {
            params: new HttpParams().set("codigo", areaId)
        });
    }

    listarAreasbySede(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/areas",{
            params: new HttpParams().set("mostrarInactivos",  String(this.myBool))
        })));
    }

    listarAreasSinPalomar(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/areas/libres")));
    }

    crearArea(area: any): Observable<any> {
        return this.client.post(this.prefix + "/areas", {
            id:area.id,
            nombre: area.nombre,
            ubicacion: area.ubicacion,
            sedeId:area.sede.id, 
            palomarId: area.palomar.id,
        });
    }

    modificarArea(area: any): Observable<any> {
        return this.client.post(this.prefix + "/areas", {
            id:area.id,
            nombre: area.nombre,
            ubicacion: area.ubicacion,
            sedeId: area.sede.id, 
            palomarId: area.palomar.id,
            activo:area.activo
        });
    }

    listarAreasDeUTD(mostrarInactivos: boolean): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/areas", {
            params: new HttpParams().set("mostrarInactivos",  String(mostrarInactivos))
        })));
    }

    listarAreasItem(): Observable<any[]> {
        return this.client.get(this.prefix + "/areas/items");
    }

    listarAreasDeUTDParaTurnoRecorrido(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/areasparaturnorecorrido")));
    }

    


}