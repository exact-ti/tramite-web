import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { Configuracion } from 'src/app/core/model/configuracion.model';
import { IContingenciaRepository } from 'src/app/core/repository/contingencia.repository';
import { IUtdRepository } from 'src/app/core/repository/utd.repository';
import { flatMap } from 'rxjs/operators';
import { Utd } from 'src/app/core/model/utd.model';

@Injectable()
export class ContingenciaProvider extends IContingenciaRepository {

    constructor(
        private client: RequesterService,
        private utdRepository: IUtdRepository,
    ) {
        super();
    }

    private configuraciones: Configuracion[];

    private prefix: string = "/servicio-tramite";


    registrarContingencia(registros: any[], file: File): Observable<any> {
        const formData = new FormData();
        formData.append('registros', JSON.stringify(registros));
        formData.append('file', file);       
        return this.utdRepository.listarUtdSeleccionado().pipe(flatMap((utd: Utd) => this.client.post(this.prefix + "/utds/" + utd.id.toString() + "/contingencias", formData)));
    }




}
