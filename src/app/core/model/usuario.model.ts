import { Sede } from './sede.model';

export class Usuario {
    constructor(
        public id: string,
        public nombre: string,
        public username: Sede,
        public correo:string,
        public perfil:string,
    ){}

}