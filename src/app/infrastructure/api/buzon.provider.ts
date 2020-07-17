import { Injectable } from "@angular/core";
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { Observable, of } from 'rxjs';
import { Buzon } from 'src/app/core/model/buzon.model';
import { RequesterService } from './core/requester.service';
import { map, flatMap, last } from 'rxjs/operators';
import { TipoBuzon } from 'src/app/core/model/tipo-buzon.model';
import { HttpParams } from '@angular/common/http';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { Utd } from 'src/app/core/model/utd.model';
import { TipoBuzonEnum } from 'src/app/enum/tipoBuzon.enum';

@Injectable()
export class BuzonProvider extends IBuzonRepository {


   
    
    constructor(private client: RequesterService,
        private utdRepository: IUtdRepository){
        super();
    }

    private buzonSeleccionado: Buzon;
    private buzonesDelUsuario: Buzon[];
    private myBool: boolean = true;
    private prefix: string = "/servicio-tramite";

    listarBuzonesDelUsuario(): Observable<Buzon[]> {
        if (!this.buzonesDelUsuario) {
            return this.client.get(this.prefix + "/usuarios/buzones").pipe(map((response: any) => {
                this.buzonesDelUsuario = response.map((element)=> new Buzon(element.id, element.nombre, new TipoBuzon(element.tipoBuzon.id, element.tipoBuzon.nombre)));
                return this.buzonesDelUsuario;
            }));
        }else{
            return of(this.buzonesDelUsuario);
        }
        
    }
    
    listarBuzonSeleccionado(): Observable<Buzon> {
        if (!this.buzonSeleccionado) {
            return this.client.get(this.prefix + "/usuarios/buzones").pipe(map((response: any) => {                
                this.buzonesDelUsuario = response.map((element)=> new Buzon(element.id, element.nombre, new TipoBuzon(element.tipoBuzon.id, element.tipoBuzon.nombre)));
                this.buzonSeleccionado = this.buzonesDelUsuario.find(buzones => buzones.tipoBuzon.id == 1);
                return this.buzonSeleccionado;
            }));
        }else{
            return of(this.buzonSeleccionado);
        }
    }

    seleccionarBuzon(buzon: Buzon): Buzon {
        this.buzonSeleccionado = buzon;
        return this.buzonSeleccionado;
    }

    listarDestinatariosFrecuentes(cantidad: number): Observable<any> {
        return this.listarBuzonSeleccionado().pipe(flatMap((buzonSeleccionado)=>{
            return this.client.get(this.prefix + "/buzones/" + buzonSeleccionado.id + "/destinatariosfrecuentes", {
                params: new HttpParams().set("cantidad", cantidad.toString()),
            });
        }), last());
        
    }
    buscarDestinatariosPorFiltro(filtro: string): Observable<any> {
        return this.client.get(this.prefix + "/buzones", {
            params: new HttpParams().set("filtro", filtro),
        });
    }

    listarBuzonesMantenimiento(): Observable<any> {
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.get(this.prefix + "/utds/" + utd.id.toString() + "/tiposbuzones/"+TipoBuzonEnum.GENERICO+"/buzones",{
            params: new HttpParams().set("mostrarInactivos",  String(this.myBool))
        })));
    }

    listarDetalleBuzon(id: number): Observable<any> {
        return this.client.get(this.prefix + "/buzones/" + id);
    }


    registrarBuzon(buzon: any): Observable<any> {
        return this.client.post(this.prefix + "/buzones", this.transformar(buzon))
    }
    editarBuzon(id: number, buzon: any): Observable<any> {
        return this.client.put(this.prefix + "/buzones/"+ id.toString(), this.transformar(buzon));
    }


    transformar(buzon: any) {
        return {
            nombre: buzon.nombre,
            usuariosIds: buzon.usuarios.map((usuario) => {
                return usuario.id
            }),
            areaId:buzon.area.id,
            activo: buzon.activo,
            tipoBuzonId:TipoBuzonEnum.GENERICO
        }
    }


}
