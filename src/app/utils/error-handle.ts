import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class ErrorHandle {

    constructor(
        private notifier: NotifierService
    ){

    }

    handleServerError(error: HttpErrorResponse):void {
        this.notifier.notify('error','Error interno del servidor: ' + error.message);
    }

}