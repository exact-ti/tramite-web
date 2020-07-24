import { Buzon } from '../model/buzon.model';
import { Subject, Observable } from 'rxjs';

export abstract class IBuzonRepository{

    abstract listarBuzonSeleccionado(): Observable<Buzon>;
    abstract seleccionarBuzon(buzon: Buzon): Buzon;
    abstract listarBuzonesDelUsuario(): Observable<Buzon[]>;
    abstract listarDestinatariosFrecuentes(cantidad: number): Observable<Buzon[]>;
    abstract buscarDestinatariosPorFiltro(filtro: string): Observable<Buzon[]>;
    abstract listarBuzonesMantenimiento(): Observable<any>;
    abstract registrarBuzon(buzon: any): Observable<any>;
    abstract editarBuzon(id: number, buzon: any): Observable<any>;
    abstract listarDetalleBuzon(id: number): Observable<any>;

}