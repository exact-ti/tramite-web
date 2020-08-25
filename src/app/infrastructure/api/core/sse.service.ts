import { Injectable } from '@angular/core';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { EventSourcePolyfill, OnMessageEvent } from 'ng-event-source';
import { Observable, Observer } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Injectable()
export class SseService {

    constructor(
        private localStorage: LocalStorage,
    ) { }

    public open(path: String): Observable<any> {

        let eventSource = new EventSourcePolyfill(AppConfig.API + path, {
            headers: {
                'Authorization': 'Bearer ' + this.localStorage.getToken(),
            }
        });

        return Observable.create((observer: Observer<any>) => {
            eventSource.onmessage = ((event: any) => {
                console.log(event);
                if (!event.errorCode) {
                    let rpta = null;
                    try{
                        rpta = JSON.parse(event.data);
                    } catch(e) {
                        console.log(e);
                    }
                    if (!rpta) {
                        return;
                    }
                    if (rpta.status == "success") {
                        console.log(rpta);
                        observer.next(rpta.data);
                    } else {
                        console.log(rpta.status + ": " + rpta.message);
                    }
                } else {
                    console.log(event.errorMessage)
                }
            });

            eventSource.onerror = ((event: any) => {
                eventSource.close();
                console.log(event);
            });

            window.onbeforeunload = () => {
                eventSource.close();
            };

        });

    }
}