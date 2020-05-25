import { Observable } from 'rxjs';

export abstract class IPaqueteRepository {
    abstract verificarSiEsParaUso(tipoPaqueteId: number, paqueteId: string): Observable<boolean>;
}