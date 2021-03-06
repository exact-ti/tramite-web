import { Observable } from 'rxjs';

export abstract class IEnvioRepository {
    abstract enviar(envio: any): Observable<any>;
    abstract listarActivosDelBuzon(filtro: string, estadosIds: number[]): Observable<any>;
    abstract listarEnviosActivosDelUsuario(usuarioId: number);
    abstract listarPorConfirmarDelBuzon(): Observable<any>;
    abstract confirmarEnvios(paquetesIds: string[]): Observable<any>;
    abstract listarDetalle(envioId: number): Observable<any>;
    abstract listarSeguimientos(envioId: number): Observable<any>;
    abstract listarPorEtapasYRangoDeFechasDelBuzon(filtro: string, etapasIds: number[], desde: string, hasta: string): Observable<any>;
    abstract listarReporteGeneral(desde: string, hasta: string, estadosIds: number[], origenesIds: number[], destinosIds: number[]): Observable<any>;
    abstract listarEnviosRetiradosPorRangoDeFechas(desde: string, hasta: string): Observable<any>;
}