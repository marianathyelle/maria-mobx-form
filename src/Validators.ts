import { FormField } from "./Interfaces";

export function required<T>(value: T, field: FormField<T>) {
    if(!value) {
        field.isValid = false;
        field.infoMessage = "Campo obrigatório";
    } else {
        field.isValid = true;
        field.infoMessage = undefined;
    }
}

export function validLength<T>(value: string, field: FormField<T>) {
    if(value && value.length < field.minLength!){
        field.isValid = false;
        field.infoMessage = `Campo mínimo de ${field.minLength!} dígitos`;
    } else {
        field.isValid = field.isValid;
        field.infoMessage = field.infoMessage;
    }
}