import {  Observable } from 'rxjs';

export abstract class IInterconexionRepository{

    abstract listarInterconexiones(): Observable<any>;
    abstract registrarInterconexion(interconexion: any): Observable<any>;
    abstract editarInterconexion(id: String, interconexion: any): Observable<any>;
    abstract listarDetalleInterconexion(id: number): Observable<any>;
    abstract listarInterconexionesMantenimiento(): Observable<any>;
    abstract listarDestinos(): Observable<any>;

}