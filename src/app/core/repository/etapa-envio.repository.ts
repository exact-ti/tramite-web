import { Observable } from 'rxjs';

export abstract class IEtapaEnvioRepository{
    abstract listar(incluirHistoricos: boolean): Observable<any>;
}