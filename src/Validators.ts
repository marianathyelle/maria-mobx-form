import { ValidatorFunction } from "./ValidatorFunction";

export const required: ValidatorFunction<any> = (value)  => {
    return value.toString().trim() ? undefined : "Campo Obrigatório"
}

export const minLength = (minLength: number): ValidatorFunction<string> => (value) => {
    return value && value.replace(/[^\d\w]+/g, '').trim().length >= minLength ? undefined : `Campo mínimo de ${minLength} dígitos`
}
