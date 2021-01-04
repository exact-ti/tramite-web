import { Observable } from 'rxjs';

export abstract class ISedeRepository {
    abstract listarSedesDeUTD(): Observable<any>;
    abstract listarItemsSedesDeUtdPorTipoSede(tipoSedeId: number): Observable<any>;
    abstract listarDetalleDeSede(id: number): Observable<any>;
    abstract registrarSede( sede: any): Observable<any>;
    abstract actualizarSede(sedeId: number,sede: any): Observable<any>;
}