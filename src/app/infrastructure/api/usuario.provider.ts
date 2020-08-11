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
        return this.client.get(this.prefix + "/usuarios/");
    }

    listarPerfilesDeUsuario(): Observable<any[]> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/usuarios")));
    }

    listarTiposUsuario(): Observable<any[]> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/usuarios")));
    }


    listarDetalleUsuario(id: number): Observable<any> {
        return this.client.get(this.prefix + "/usuarios/" + id);
    }

    listarUsuariosConBuzon(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap(utd => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/usuariosconbuzon")));
    }


    registrarUsuario(usuario: any): Observable<any> {
        return this.client.post(this.prefix + "/usuarios", this.transformar(usuario))
    }

    editarUsuario(id: number, usuario: any): Observable<any> {
        return this.client.put(this.prefix + "/usuarios/"+ id.toString(), this.transformar(usuario));
    }

    transformar(usuario: any) {
        return {
            username: usuario.username,
            nombre: usuario.nombre,
            correo: usuario.correo,
            utds: usuario.utds.map((utd) => {
                return utd.id
            }),
            perfilId: usuario.perfil.id,
            password: usuario.contrasena,
            areaId:usuario.area == null ? null:usuario.area.id,
            activo: usuario.activo,
        }
    }

}