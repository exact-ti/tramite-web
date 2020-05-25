import { Observable } from 'rxjs';

export abstract class IEnvioRepository {
    abstract enviar(envio: any): Observable<any>;
    abstract listarActivosDelBuzon(filtro: string): Observable<any>;
    abstract listarPorConfirmarDelBuzon(): Observable<any>;
    abstract confirmarEnvios(paquetesIds: string[]): Observable<any>;
    abstract listarDetalle(envioId: number): Observable<any>;
    abstract listarSeguimientos(envioId: number): Observable<any>;
}