import { Observable } from 'rxjs';


export abstract class IUsuarioRepository {
    
    abstract listarOperativosDeUTD(): Observable<any[]>;
    
}