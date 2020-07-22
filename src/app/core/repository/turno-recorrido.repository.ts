import { Observable } from 'rxjs';


export abstract class ITurnoRecorridoRepository {
    
    abstract listarTurnosRecorridosDeUTD(): Observable<any[]>;
    abstract listarDetalleTurnoRecorrido(id: number): Observable<any>;
    abstract registrarTurnoRecorrido(turnoRecorrido: any): Observable<any>;
    abstract editarTurnoRecorrido(id: number, turnoRecorrido: any): Observable<any>;
    abstract listarTurnos(): Observable<any>;

}