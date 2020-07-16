import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { map, flatMap } from 'rxjs/operators';
import { IConfiguracionRepository } from 'src/app/core/repository/configuracion.repository';
import { Configuracion } from 'src/app/core/model/configuracion.model';
import { ErrorHandle } from 'src/app/utils/error-handle';
import { IDashboardRepository } from 'src/app/core/repository/dashboard.repository';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { Buzon } from 'src/app/core/model/buzon.model';

@Injectable()
export class DashboardProvider extends IDashboardRepository {
    
    constructor(
        private client: RequesterService,
        private buzonRepository: IBuzonRepository        
        ) {
        super();
    }

    respuesta:any;
    private prefix: string = "/servicio-tramite";

    listarIndicadores(): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.client.get(this.prefix + "/buzones/" + buzon.id.toString() + "/indicadores")));
    }



}
