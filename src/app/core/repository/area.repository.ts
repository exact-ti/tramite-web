import { Buzon } from '../model/buzon.model';
import { Subject, Observable } from 'rxjs';
import { Area } from '../model/area.model';

export abstract class IAreaRepository {
    abstract verificarExistencia(areaId: string): Observable<boolean>;
    abstract listarAreasbySede(): Observable<any>;

}