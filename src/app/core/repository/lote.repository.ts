import { Observable } from 'rxjs';

export abstract class ILoteRepository{

    abstract listarReporteLotes(desde: string, hasta: string): Observable<any>;
}