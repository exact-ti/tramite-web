import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';


@Injectable()
export class RequesterService {
    
    constructor(
        private httpClient: HttpClient
    ) {}

    public get(path: string, options: {} = {}): Observable<any>{
        return this.httpClient.get(AppConfig.API + path, options);
    }

    public post(path: string, body: {} = null, options: {} = {}): Observable<any>{
        return this.httpClient.post(AppConfig.API + path, body, options);
    }

    public put(path: string, body: {} = null, options: {} = {}): Observable<any>{
        return this.httpClient.put(AppConfig.API + path, body, options);
    }

    
    
    

}