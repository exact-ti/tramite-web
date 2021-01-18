import { Observable } from 'rxjs';

export abstract class ITipoAgenciaRepository {

    abstract listarTiposAgenciasItemsDeLaUtd(): Observable<any>;

}