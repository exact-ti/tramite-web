import { ITurnoRecorridoRepository } from 'src/app/core/repository/turno-recorrido.repository';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { flatMap, map } from 'rxjs/operators';
import { Area } from 'src/app/core/model/area.model';


@Injectable()
export class TurnoRecorridoProvider extends ITurnoRecorridoRepository{

    

    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository,

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";

    listarTurnosRecorridosDeUTD(): Observable<any[]> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/turnos")));
    }

    listarDetalleTurnoRecorrido(id: number): Observable<any> {
        return this.client.get(this.prefix + "/turnos/" + id.toString());
    }

    listarTurnos(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/turnos")));
    }

    registrarTurnoRecorrido(turnoRecorrido: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.post(this.prefix + "/utds/" + utd.id.toString() + "/turnos", this.transformar(turnoRecorrido))));
    }

    editarTurnoRecorrido(id: number, turnoRecorrido: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.put(this.prefix + "/turnos/" + id.toString(), this.transformar(turnoRecorrido))));
    }



    

    transformar(turnoRecorrido: any) {
        return {
            nombre: turnoRecorrido.nombre,
            usuarioId: turnoRecorrido.operativo.id,
            usuarioNombre: turnoRecorrido.operativo.descripcion,
            areas: turnoRecorrido.areas.map((area, index) => {
                return {
                    id: area.id,
                    orden: index
                }
            }),
            horaInicio: turnoRecorrido.horaInicio.substring(0,5) + ":00",
            horaFin: turnoRecorrido.horaFin.substring(0,5) + ":00",
            activo: turnoRecorrido.activo,
        }
    }
    
    

}