import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { map } from 'rxjs/operators';
import { IPerfilRepository } from 'src/app/core/repository/perfil.repository';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class PerfilProvider extends IPerfilRepository {

    constructor(private client: RequesterService){
        super();
    }

    private tipoPerfil: any;

    private prefix: string = "/servicio-perfil";

    listarTipoPerfil(): Observable<any> {
        if (!this.tipoPerfil) {
            return this.client.get(this.prefix + "/tiposperfiles/usuarioautenticado").pipe(map(data => {
                this.tipoPerfil = data;
                return this.tipoPerfil;
            }));
        }else{
            return of(this.tipoPerfil);
        }
    }
    
    listarTipoPerfilItem(): Observable<any[]> {
        return this.client.get(this.prefix + "/tiposperfiles", {
            params: new HttpParams().set("incluirInactivos",  String(false))
        })
    }

    listarPerfilByTipoPerfilId(tipoPerfil: any): Observable<any[]> {
        return this.client.get(this.prefix + "/tiposperfiles/"+String(tipoPerfil)+"/perfiles");
    }

}
