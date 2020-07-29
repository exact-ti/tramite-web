import { Inject, Injectable } from "@angular/core";

@Injectable()
export class SubmitForm {

    public submit(atributos: any, parametros: any): void {
        const form = window.document.createElement("form");
        for (let key in atributos)
            form.setAttribute(key, atributos[key]);
        for (let key in parametros)
            form.appendChild(this.createHiddenElement(key, parametros[key]));
        window.document.body.appendChild(form);
        form.submit();
    }

    private createHiddenElement(name: string, value: string): HTMLInputElement {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('name', name);
        hiddenField.setAttribute('value', value);
        hiddenField.setAttribute('type', 'hidden');
        return hiddenField;
    }

}