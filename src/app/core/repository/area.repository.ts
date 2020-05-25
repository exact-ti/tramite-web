import { Buzon } from '../model/buzon.model';
import { Subject, Observable } from 'rxjs';

export abstract class IAreaRepository {
    abstract verificarExistencia(areaId: string): Observable<boolean>;
}