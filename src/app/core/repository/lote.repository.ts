import { Observable } from 'rxjs';

export abstract class ILoteRepository{

    abstract listarReporteLotes(desde: Date, hasta: Date): Observable<any>;
}