import { Subject, Observable } from 'rxjs';
import { Sede } from '../model/sede.model';

export abstract class ISedeRepository {
    abstract listarSedes(): Observable<any>;
    abstract listarSedesSave(): Sede[];
    abstract listarItemsSedesDeUtdPorTipoSede(tipoSedeId: number): Observable<any>;

}