import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'customDatePipe'
})
export class CustomDatePipe implements PipeTransform {

  transform(fecha: string, format: string): string {
    let fechaM = moment(fecha).tz('America/Lima');
    let fechaS = fechaM.format('L LT');
    return fechaS;
  }
}