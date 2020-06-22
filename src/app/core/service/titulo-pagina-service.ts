import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';


@Injectable()
export class TituloPaginaService {
    
    constructor(){}  

    tituloPaginaSubject: Subject<string> = new Subject<string>();

}
