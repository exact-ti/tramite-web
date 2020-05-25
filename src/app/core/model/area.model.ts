import { Sede } from './sede.model';

export class Area {

    constructor(
        public id: string,
        public nombre: string,
        public sede: Sede,
    ){}

}