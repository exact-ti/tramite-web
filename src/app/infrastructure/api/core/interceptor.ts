import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
    HttpResponse, HttpUserEvent, HttpHeaders, HttpErrorResponse, HttpClient, 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { AppConfig } from 'src/app/app.config';
import { catchError, flatMap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class Interceptor implements HttpInterceptor {

    headers: HttpHeaders;
    notificacionExpirado = false;

    constructor(
        private client: HttpClient,
        private localStorage: LocalStorage,
        private notifier: NotifierService,
    ) {
        this.adicionarHeaders();    
    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        let authReq = req;
        authReq = req.clone({
            headers: this.headers
        });
        return next.handle(authReq).pipe(catchError((err: HttpErrorResponse) => {
            console.log(err);
            if (err.error.status == 894) {
                this.ponerRefreshTokenEnHeader();
                return this.client.post(AppConfig.API + "/servicio-auth/auth/refresh", null).pipe(flatMap(rpta => {
                    if (rpta["status"] == "success") {
                        console.log(rpta);
                        this.localStorage.saveTokens(rpta["data"]["access_token"], rpta["data"]["refresh_token"]);
                        authReq = req.clone({
                            headers: new HttpHeaders({
                                "Authorization": "Bearer " + this.localStorage.getToken(),
                                'Accept': 'application/json',
                            })
                        });
                        return next.handle(authReq);
                    }else{
                        if (!this.notificacionExpirado) {
                            this.notifier.notify("info", "Su sesión ha expirado");
                            this.notificacionExpirado = true;    
                        }                        
                        setTimeout(() => {
                            window.location.href = AppConfig.LOGIN_URL;
                        }, 2 * 1000);                        
                        return throwError(err); 
                    }                           
                }));
            }else{
                return throwError(err);
            }
            
        }));
    }


    private adicionarHeaders(): void {
        this.headers = new HttpHeaders({
            "Authorization": "Bearer " + this.localStorage.getToken(),
            'Accept': 'application/json',
        });

        this.localStorage.onTokensSaved.subscribe(() => {
            this.headers = new HttpHeaders({
                "Authorization": "Bearer " + this.localStorage.getToken(),
                'Accept': 'application/json',
            });
        });
    }

    private ponerRefreshTokenEnHeader(): void {
        this.headers = new HttpHeaders({
            "Authorization": "Bearer " + this.localStorage.getRefreshToken(),
            'Accept': 'application/json',
        });

    }

}
