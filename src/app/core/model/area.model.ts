import { Sede } from './sede.model';
import { Palomar } from './palomar.model';

export class Area {
    constructor(
        public id: number,
        public codigo: string,
        public nombre: string,
        public sede: Sede,
        public palomar:Palomar,
        public sedeId: number,
        public palomarId: number,
        public ubicacion:string,
        public tipoSede:string,
        public activo:boolean
    ){}

}