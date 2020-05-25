export class Menu {

    constructor(
        public id: number,
        public nombre: string,
        public orden: number,
        public icono: string,
        public link: string,
        public home: boolean,
        public hijos: Menu[],
    ){}

}