import {  Observable } from 'rxjs';

export abstract class IInterconexionRepository{

    abstract listarInterconexiones(): Observable<any>;

}