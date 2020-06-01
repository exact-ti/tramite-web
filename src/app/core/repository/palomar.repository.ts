import { Subject, Observable } from 'rxjs';
import { Palomar } from '../model/palomar.model';

export abstract class IPalomarRepository {
    abstract listarPalomares(): Observable<any>;
    abstract listarPalomaresSave(): Palomar[];

}