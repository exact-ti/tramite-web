import { IMenuRepository } from 'src/app/core/repository/menu.repository';
import { Injectable } from '@angular/core';
import { Menu } from 'src/app/core/model/menu.model';
import { Observable, Subject, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { map } from 'rxjs/operators';
import { ErrorHandle } from 'src/app/utils/error-handle';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class MenuProvider extends IMenuRepository {
    
          

    constructor(
        private client: RequesterService,
        private errorHandle: ErrorHandle,
        ) {
        super();
    }

    private prefix: string = "/servicio-menu";

    private menu: Menu[];

    listarMenu(): Observable<Menu[]> {

        if (!this.menu) {
            return this.client.get(this.prefix + '/menus', {
                params: new HttpParams().set("tipoClienteId", String(2))
            }).pipe(map((respuesta: any) => {
                this.menu = this.convertirRespuesta(respuesta);
                return this.menu;
              }));
        }else{
            return of(this.menu);
        }       
    } 

    private convertirRespuesta(respuesta: any): Menu[] {
        return respuesta.map((elemento: any) => new Menu(elemento.id, elemento.nombre, elemento.orden, elemento.icono, elemento.link, elemento.home, this.convertirRespuesta(elemento.menuHijos)));
    }

    public listarNombreByRuta(ruta: string): Observable<String>{
        if (ruta == "/") {
            return this.listarMenuPrincipal().pipe(map(menu => menu.nombre));   
        }
        return this.listarMenu().pipe(map(menu => this.listarOpciones(menu).find(item => item.link == ruta).nombre));
    }

    public listarMenuPrincipal(): Observable<Menu> {
        return this.listarMenu().pipe(map(menus => menus.find(menu => menu.home)));
    }

    public listarOpciones(menu: Menu[]): Menu[]{

        let menus: Menu[] = [];

        for (let index = 0; index < menu.length; index++) {
            if (menu[index].menuHijos && menu[index].menuHijos.length > 0) {
                let menus2 = [...this.listarOpciones(menu[index].menuHijos)];
                menus2.forEach(menu2 => menus.push(menu2));
            }else{
                menus.push(menu[index]);
            }            
        }

        return menus;
    }

    listarMenuPorTipoPerfil(tipoPerfilId: number): Observable<any[]> {
        return this.client.get(this.prefix + "/menus/tree", {
            params: new HttpParams()
            .set("tipoPerfilId", tipoPerfilId.toString())
        });
    } 

    listarMenuByRuta(ruta: string): Observable<Menu> {
        if (ruta == "/") {
            return this.listarMenuPrincipal();   
        }
        return this.listarMenu().pipe(map(menu => this.listarOpciones(menu).find(item => item.link == ruta)));
    }





}