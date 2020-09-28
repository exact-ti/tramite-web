import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as XLSX from 'xlsx';
import * as lodash from 'lodash-es';


const Excel_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, excelFileName + Excel_EXTENSION);
  }

  public excelToJson(file: Blob): Observable<any> {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    return new Observable((observer: Observer<any>) => {
      reader.onload = () => {
        const data = reader.result;
        let workBook = XLSX.read(data, { type: 'binary' });
        let jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        observer.next(jsonData);
      }
    });    
  }

  public getSheet(file: Blob, sheet: string): Observable<any> {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    return new Observable((observer: Observer<any>) => {
      reader.onload = () => {
        const data = reader.result;
        let workBook = XLSX.read(data, { type: 'binary' });
        observer.next(workBook.Sheets[sheet]);
      }
    });    
  }

  public listarCabeceras(sheet: XLSX.WorkSheet): string[]{
    let asciiLetra = 65; //A
    let cabeceras = [];
    let cabecera = sheet[String.fromCharCode(asciiLetra) + '1']?.v;
    while(!cabecera){
      asciiLetra ++;
      cabecera = sheet[String.fromCharCode(asciiLetra) + '1']?.v;
    }
    while(cabecera) {
      cabeceras.push(cabecera);
      asciiLetra ++;
      cabecera = sheet[String.fromCharCode(asciiLetra) + '1']?.v;
    }
    return cabeceras; 
  } 

  public toJson(sheet: XLSX.WorkSheet, cabeceras: string[]): any[] {
    let rows = XLSX.utils.sheet_to_json(sheet).map(row => lodash.pick(row, cabeceras));
    return rows;
  }

}