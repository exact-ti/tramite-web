import { Observable } from 'rxjs';

export abstract class INotificacionRepository {

    abstract escucharNotificacionesNuevas(): Observable<any>;
    abstract listarNotificacionesPendientesDelUsuario(): Observable<any>;
    abstract actualizarVistoNotificacionesDelUsuario(): Observable<any>;
    abstract actualizarRevisionNotificacion(id: number): Observable<any>;

}