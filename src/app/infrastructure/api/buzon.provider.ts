import { Injectable } from "@angular/core";
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { Observable, of } from 'rxjs';
import { Buzon } from 'src/app/core/model/buzon.model';
import { RequesterService } from './core/requester.service';
import { map, flatMap, last } from 'rxjs/operators';
import { TipoBuzon } from 'src/app/core/model/tipo-buzon.model';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class BuzonProvider extends IBuzonRepository {

   
    
    constructor(private client: RequesterService){
        super();
    }

    private buzonSeleccionado: Buzon;
    private buzonesDelUsuario: Buzon[];

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

}
