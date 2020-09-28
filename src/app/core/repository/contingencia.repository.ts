import { Configuracion } from '../model/configuracion.model';
import { Observable } from 'rxjs';

export abstract class IContingenciaRepository{

    abstract registrarContingencia(registros: any[], file: File): Observable<any>;
}