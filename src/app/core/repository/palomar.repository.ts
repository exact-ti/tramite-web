import { Subject, Observable } from 'rxjs';
import { Palomar } from '../model/palomar.model';

export abstract class IPalomarRepository {
    abstract listarPalomares(): Observable<any>;
    abstract listarPalomaresSave(): Palomar[];
    abstract listarPalomaresPrincipal(): Observable<any>;
    abstract listarDetallePalomar(id: string): Observable<any>;
    abstract registrarPalomar(palomar: any): Observable<any>;
    abstract editarPalomar(id: String, palomar: any): Observable<any>;
}