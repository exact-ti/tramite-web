import { ITurnoRecorridoRepository } from 'src/app/core/repository/turno-recorrido.repository';
import { Injectable } from '@angular/core';
import { Observable, scheduled } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { flatMap, map } from 'rxjs/operators';
import { IUsuarioRepository } from 'src/app/core/repository/usuario.repository';
import {of} from 'rxjs';


@Injectable()
export class UsuarioProvider extends IUsuarioRepository{
    
    

    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository,

    ){
        super();
    }

    private prefix: string = "/servicio-tramite";
    private prefixUsuario: string = "/servicio-usuario";

    listarDetalleDelUsuarioAutenticado(): Observable<any> {
        return this.client.get(this.prefixUsuario + "/usuarios/autenticado/detalle");
    }

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
            codigo: usuario.codigo,
            username: usuario.username,
            nombre: usuario.nombre,
            correo: usuario.correo,
            utds: usuario.utds,
            perfilId: usuario.perfil.id,
            password: usuario.contrasena,
            areaId:usuario.area == null ? null:usuario.area.id,
            activo: usuario.activo,
        }
    }

    cambiarPassword(passwordActual: string, passwordNuevo: string): Observable<any> {
        return this.client.put(this.prefixUsuario + "/usuarios/autenticado/password", {
            passwordActual,
            passwordNuevo
        });
    }

}