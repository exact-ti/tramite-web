import { Injectable } from '@angular/core';
import { LocalStorage } from 'src/app/core/repository/local-storage';
import { Subject } from 'rxjs';

@Injectable()
export class LocalStorageService extends LocalStorage {
    
    
    deleteTokens(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
    }

    constructor(){
        super();
        this.onTokensSaved = new Subject<void>();
    }
    
    getToken(): string {
        return localStorage.getItem('token');
    }

    getRefreshToken(): string {
        return localStorage.getItem('refresh_token');
    }

    isTokensSaved(): boolean {
        if(localStorage.getItem('token') && localStorage.getItem('refresh_token')) return true;
        return false;

    }
        
    saveTokens(token: string, refreshToken: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('refresh_token', refreshToken);
        this.onTokensSaved.next();
    }

}