import { Observable } from 'rxjs';
import { Utd } from '../model/utd.model';

export abstract class IUtdRepository {
    abstract listarUtdsdelUsuario(): Observable<Utd[]>;
    abstract listarUtdSeleccionado(): Observable<Utd>;
    abstract listarUtds(): Observable<any>;


}