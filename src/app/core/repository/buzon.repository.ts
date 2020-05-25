import { Buzon } from '../model/buzon.model';
import { Subject, Observable } from 'rxjs';

export abstract class IBuzonRepository{

    abstract listarBuzonSeleccionado(): Observable<Buzon>;
    abstract seleccionarBuzon(buzon: Buzon): void;
    abstract listarBuzonesDelUsuario(): Observable<Buzon[]>;
    abstract listarDestinatariosFrecuentes(cantidad: number): Observable<Buzon[]>;
    abstract buscarDestinatariosPorFiltro(filtro: string): Observable<Buzon[]>;
}