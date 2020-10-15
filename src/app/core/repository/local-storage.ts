import { Subject } from 'rxjs';

export abstract class LocalStorage {

    public onTokensSaved: Subject<void>;
    abstract saveTokens(token: string, refreshToken: string): void;
    abstract isTokensSaved(): boolean;
    abstract getToken(): string;
    abstract getRefreshToken(): string;
    abstract deleteTokens(): void;
    
}