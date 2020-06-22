import { Subject, Observable } from 'rxjs';
import { Menu } from '../model/menu.model';

export abstract class IMenuRepository{

    abstract listarMenu(): Observable<Menu[]>;
    abstract listarNombreByRuta(ruta: string): string;
}