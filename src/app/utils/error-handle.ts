import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorHandle {

    handleServerError(error: HttpErrorResponse):void {
        alert('Error interno del servidor: ' + error.message);
        //window.location.href = AppConfig.LOGIN_URL;
    }

}