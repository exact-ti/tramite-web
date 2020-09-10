import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
    HttpResponse, HttpUserEvent, HttpErrorResponse, HttpHeaders, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { tap, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class Interceptor implements HttpInterceptor {

    headers: HttpHeaders;

    constructor(
        private localStorage: LocalStorage,
        private spinner: NgxSpinnerService,
    ) {
        this.adicionarHeaders();

    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        let authReq = req;
        authReq = req.clone({
            headers: this.headers
        });
        return next.handle(authReq);
    }


    private adicionarHeaders(): void {
        this.headers = new HttpHeaders({
            "Authorization": "Bearer " + this.localStorage.getToken(),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });

        this.localStorage.onTokensSaved.subscribe(() => {
            this.headers = new HttpHeaders({
                "Authorization": "Bearer " + this.localStorage.getToken(),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            });
        });
    }

}
