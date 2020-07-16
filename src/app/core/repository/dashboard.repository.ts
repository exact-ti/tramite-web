import { Configuracion } from '../model/configuracion.model';
import { Observable } from 'rxjs';

export abstract class IDashboardRepository{

    abstract listarIndicadores(): Observable<any>;
}