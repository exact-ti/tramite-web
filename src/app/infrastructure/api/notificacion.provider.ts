import { Injectable } from '@angular/core';
import { INotificacionRepository } from 'src/app/core/repository/notificacion.repository';
import { Observable } from 'rxjs';
import { RequesterService } from './core/requester.service';
import { EventSourcePolyfill } from 'ng-event-source';
import { Configuracion } from 'src/app/core/model/configuracion.model';
import { AppConfig } from 'src/app/app.config';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { SseService } from './core/sse.service';
import { IBuzonRepository } from 'src/app/core/repository/buzon.repository';
import { flatMap } from 'rxjs/operators';
import { Buzon } from 'src/app/core/model/buzon.model';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class NotificacionProvider extends INotificacionRepository {

    constructor(
        private sse: SseService,
        private requester: RequesterService,
        private buzonRepository: IBuzonRepository,
    ) {
        super();
    }

    private prefix: string = "/servicio-tramite";

    escucharNotificacionesNuevas(): Observable<any> {
        return this.sse.open(this.prefix + "/notificaciones/sse");
    }

    listarNotificacionesPendientesDelUsuario(): Observable<any> {
        return this.requester.get(this.prefix + "/notificaciones/pendientes");
    }

    actualizarVistoNotificacionesDelUsuario(): Observable<any> {
        return this.buzonRepository.listarBuzonSeleccionado().pipe(flatMap((buzon: Buzon) => this.requester.put(this.prefix + "/notificaciones/visto",null, {
            params: new HttpParams().set("buzonId", buzon.id.toString())
        })));
    }

    actualizarRevisionNotificacion(id: number): Observable<any> {
        return this.requester.put(this.prefix + "/notificaciones/" + id.toString() + "/revision");
    }

} 