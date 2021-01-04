import { Observable } from 'rxjs';

export abstract class ITipoAgenciaRepository {

    abstract listarTiposAgenciasItems(): Observable<any>;

}