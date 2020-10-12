import { Injectable } from "@angular/core";
import * as moment from 'moment';

@Injectable()
export class UtilsService {

  constructor() { }

  public isEmpty(data): boolean {
    if ((data instanceof Array && data.length == 0) || (data instanceof String && data.trim().length === 0) || (data === '')) {
      return true;
    }
    return false;
  }

  public isUndefinedOrNull(data): boolean {
    return data === undefined || data === null;
  }

  public isUndefinedOrNullOrEmpty(data): boolean {
    return this.isUndefinedOrNull(data) || this.isEmpty(data);
  }

  public isValidDate(d) {
    return d instanceof Date && !isNaN(d.getTime());
  }


  public getJsDateFromExcel(serial) {
    var utc_days = Math.floor(serial - 25568);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }

  public svgToBase64(element: Element) {
    var s = new XMLSerializer().serializeToString(element);
    var encodedData = window.btoa(s);
    return 'data:image/svg+xml;base64,' + encodedData;
  }

  public static tableSettings = {
    editable: false,
    columns: {},
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true,
    attr: {
      class: 'table table-bordered'
    }
  }

  public deepEqual(object1, object2): boolean {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (
        areObjects && !this.deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }

    return true;
  }

  private isObject(object): boolean {
    return object != null && typeof object === 'object';
  }

  public parseDate(date: string): string{
    return moment(date, "YYYY/MM/DD").format("DD/MM/yyyy");
  }

  public copy(aObject) {
    if (!aObject) {
      return aObject;
    }
  
    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? this.copy(v) : v;
    }
  
    return bObject;
  }

  public excelDateToJSDate(serial: number) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return this.addDays(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds),1);
 }

 addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}

}