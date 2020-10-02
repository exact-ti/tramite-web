import { Observable } from 'rxjs';

export abstract class ITipoSedeRepository {

    abstract listarTiposSedes(): Observable<any>;

}