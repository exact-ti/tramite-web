import { Observable } from 'rxjs';

export abstract class ITipoPaqueteRepository {

    abstract listarTiposPaquetes(interno: boolean, incluirInactivos: boolean): Observable<any>;
    abstract registrarTipoPaquete(tipoPaquete: any): Observable<any>;
    abstract actualizarTipoPaquete(id: number, tipoPaquete: any): Observable<any>;

}