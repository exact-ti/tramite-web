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

    listarUsuariosMantenimiento(): Observable<any[]> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/usuarios")));
    }

    listarPerfilesDeUsuario(): Observable<any[]> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/usuarios")));
    }

    listarTiposUsuario(): Observable<any[]> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/usuarios")));
    }


    listarDetalleUsuario(id: number): Observable<any> {
        return this.client.get(this.prefix + "/interconexiones/" + id);
    }


    registrarUsuario(usuario: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.post(this.prefix + "/utds/" + utd.id.toString() + "/turnos", this.transformar(usuario))));
    }

    editarUsuario(id: number, usuario: any): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.put(this.prefix + "/turnos/" + id.toString(), this.transformar(usuario))));
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