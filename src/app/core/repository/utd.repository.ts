import { Observable } from 'rxjs';
import { Utd } from '../model/utd.model';

export abstract class IUtdRepository {
    abstract listarUtdsdelUsuario(): Observable<Utd[]>;
    abstract listarUtdSeleccionado(): Observable<Utd>;
    abstract listarUtdsActivos(): Observable<any>;
    abstract seleccionarUtd(utd:any): Observable<any>;
}