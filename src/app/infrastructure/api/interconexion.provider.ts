import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import { flatMap } from 'rxjs/operators';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Utd } from 'src/app/core/model/utd.model';
import { IInterconexionRepository } from 'src/app/core/repository/interconexion.repository';

@Injectable()
export class InterconexionProvider extends IInterconexionRepository{



    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    private myBool: boolean = true;

    listarInterconexiones(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/areas",{
            params: new HttpParams().set("mostrarInactivos",  String(this.myBool))
        })));
    }

    listarInterconexionesMantenimiento(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/interconexiones")));    }

    listarAreasSinPalomar(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/areas/libres")));
    }

        
    registrarInterconexion(palomar: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.post(this.prefix + "/utds/" + utd.id.toString() + "/interconexiones", palomar)));
    }

    editarInterconexion(id: String, palomar: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.put(this.prefix + "/interconexiones/" + id.toString(), palomar)));
    }

    listarDetalleInterconexion(id: number): Observable<any> {
        return this.client.get(this.prefix + "/interconexiones/" + id);
    }

    listarDestinos(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/destinos")));
    }

    transformar(palomar: any) {
        let palomares : String[]= [];
        palomar.areas.map((area) => {
            palomares.push(area.id);
        })
        return {
            ubicacion: palomar.ubicacion,
            areas: palomares,
            activo: palomar.activo,
        }
    }
  

}