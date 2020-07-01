import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { HttpParams } from '@angular/common/http';
import { IAreaRepository } from 'src/app/core/repository/area.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Utd } from 'src/app/core/model/utd.model';
import { map, flatMap, last } from 'rxjs/operators';

@Injectable()
export class UtdProvider extends IUtdRepository{


    constructor(
        private client: RequesterService
    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    private utdSeleccionado: Utd;
    private utdsDelUsuario: Utd[];

    listarUtdsdelUsuario(): Observable<Utd[]> {
        if (!this.utdsDelUsuario) {
            return this.client.get(this.prefix + "/usuarios/utds").pipe(map((response: any) => {
                this.utdsDelUsuario = response.map((element)=> new Utd(element.id, element.nombre, element.principal));
                return this.utdsDelUsuario;
            }));
        }else{
            return of(this.utdsDelUsuario);
        }
        
    }
    
    listarUtdSeleccionado(): Observable<Utd> {
        if (!this.utdSeleccionado) {
            return this.client.get(this.prefix + "/usuarios/utds").pipe(map((response: any) => {                
                this.utdsDelUsuario = response.map((element)=> new Utd(element.id, element.nombre, element.principal));
                this.utdSeleccionado = this.utdsDelUsuario.find(buzones => buzones.principal == true );
                return this.utdSeleccionado;
            }));
        }else{
            return of(this.utdSeleccionado);
        }
    }

    listarUtds(): Observable<any> {
        return this.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/areas")));
    }


}