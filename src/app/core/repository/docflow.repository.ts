import { Observable } from 'rxjs';

export abstract class IDocflowRepository {
    abstract listarParametrosIngreso(): Observable<any>;
    abstract listarIndicadores(): Observable<any>;
    abstract listarParametrosIndicadorDetalle(status: string): Observable<any>;
}