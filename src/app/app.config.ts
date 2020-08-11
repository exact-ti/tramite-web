import { Subject } from 'rxjs';

export class AppConfig {

    public static LOGIN_URL: string;
    public static API: string;
    public static INTEGRACION_DOCFLOW: boolean;
    public static readonly onInicialization: Subject<void> = new Subject<void>();



    public static Inicializar(loginUrl: string, api: string, integracionDocflow: boolean): void {
        this.LOGIN_URL = loginUrl;
        this.API = api;
        this.INTEGRACION_DOCFLOW = integracionDocflow;
        this.onInicialization.next();
    }

    public static DespuesDeInicializar(callback: Function): void {
        if (!this.API) {
            this.onInicialization.subscribe(() => callback());
        } else {
            callback();
        }
    }

}