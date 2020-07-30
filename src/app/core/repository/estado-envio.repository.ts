import { Observable } from 'rxjs';

export abstract class IEstadoEnvioRepository{
    abstract listar(incluirHistoricos: boolean): Observable<any>;
}