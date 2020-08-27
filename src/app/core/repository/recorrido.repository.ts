import { Observable } from 'rxjs';


export abstract class IRecorridoRepository {
    

    abstract listarReporteRecorridos(desde: string, hasta: string): Observable<any>;

}