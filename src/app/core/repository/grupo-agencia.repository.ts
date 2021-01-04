import { Observable } from 'rxjs';

export abstract class IGrupoAgenciaRepository{
    abstract listarItemsPorTipoAgencia(tipoAgenciaId: number): Observable<any>;
}