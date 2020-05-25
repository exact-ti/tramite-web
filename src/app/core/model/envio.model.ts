import { Buzon } from './buzon.model';
import { Area } from './area.model';

export class Envio {

    constructor(
        public id: number,
        public paqueteId: string,
        public remitente: Buzon,
        public destinatario: Buzon, 
        public areaRecojo: Area,
    ){}

}