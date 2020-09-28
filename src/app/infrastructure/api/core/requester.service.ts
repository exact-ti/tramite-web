import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';


@Injectable()
export class RequesterService {

    constructor(
        private httpClient: HttpClient,
        private spinner: NgxSpinnerService,
    ) { }

    public get(path: string, options: {} = {}, showSpinner = true): Observable<any> {
        if (showSpinner) this.spinner.show();
        return this.httpClient.get(AppConfig.API + path, options).pipe(finalize(() => { if (showSpinner) this.spinner.hide() }));
    }

    public post(path: string, body: {} = null, options: {} = {}, showSpinner = true): Observable<any> {
        if (showSpinner) this.spinner.show();
        return this.httpClient.post(AppConfig.API + path, body, options).pipe(finalize(() => { if (showSpinner) this.spinner.hide() }));
    }

    public put(path: string, body: {} = null, options: {} = {}, showSpinner = true): Observable<any> {
        if (showSpinner) this.spinner.show();
        return this.httpClient.put(AppConfig.API + path, body, options).pipe(finalize(() => { if (showSpinner) this.spinner.hide() }));
    }






}