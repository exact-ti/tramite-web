import { Buzon } from '../model/buzon.model';
import { Subject, Observable } from 'rxjs';
import { Area } from '../model/area.model';

export abstract class IAreaRepository {
    abstract verificarExistencia(codigo: string, showSpinner: boolean): Observable<boolean>;
    abstract listarAreasbySede(): Observable<any>;
    abstract crearArea(area: any): Observable<any>;
    abstract modificarArea(areaId: number, area: any): Observable<any>;
    abstract listarAreasDeUTD(mostrarInactivos: boolean): Observable<any>;
    abstract listarAreasDeUTDParaTurnoRecorrido(): Observable<any>;
    abstract listarAreasSinPalomar(): Observable<any>;
    abstract listarAreasItem(): Observable<any[]>;

}