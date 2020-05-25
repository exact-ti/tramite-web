import { TipoBuzon } from './tipo-buzon.model';

export class Buzon {

    constructor(
        public id: number,
        public nombre: string,
        public tipoBuzon: TipoBuzon
    ){}

}