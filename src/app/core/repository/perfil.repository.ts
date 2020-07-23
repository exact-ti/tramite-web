import { Observable } from 'rxjs';


export abstract class IPerfilRepository {
    

    abstract listarTipoPerfil(): Observable<any>;

    abstract listarTipoPerfilItem(): Observable<any[]>;

    abstract listarPerfilByTipoPerfilId(tipoPerfil:any): Observable<any[]>;

}