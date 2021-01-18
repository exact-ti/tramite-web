import { Observable } from 'rxjs';

export abstract class ITipoSedeRepository {

    abstract listarTiposSedesDeLaUtd(): Observable<any>;

}