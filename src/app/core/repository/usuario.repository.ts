import { Observable } from 'rxjs';


export abstract class IUsuarioRepository {
    
    abstract listarOperativosDeUTD(): Observable<any[]>;

    abstract listarUsuariosMantenimiento(): Observable<any>;

    abstract listarPerfilesDeUsuario(): Observable<any[]>;

    abstract listarDetalleUsuario(id: number): Observable<any>;

    abstract listarTiposUsuario(): Observable<any[]>;

    abstract registrarUsuario(usuario: any): Observable<any>;

    abstract editarUsuario(id: number, usuario: any): Observable<any>;

    abstract listarUsuariosConBuzon(): Observable<any>;

    abstract cambiarPassword(passwordActual: string, passwordNuevo: string): Observable<any>;

}