import { Configuracion } from '../model/configuracion.model';
import { Observable } from 'rxjs';

export abstract class IConfiguracionRepository{

    abstract listarConfiguracion(clave: string): Observable<Configuracion>;
}