import { Sede } from './sede.model';

export class Area {

    constructor(
        public id: string,
        public codigoBandeja: String,
        public nombre: string,
        public sede: Sede,
        public ubicacion:string,
        public tiposede:string,
        public activo:boolean
    ){}

}