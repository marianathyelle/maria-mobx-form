import { FormField, ValidatorFunction } from "./Interfaces";

export const required: ValidatorFunction<string> = (value)  => value ? undefined : "Campo Obrigatório"

export const minLength = (minLength: number): ValidatorFunction<string> => (value) => {
    return value && value.length >= minLength ? undefined : `Campo mínimo de ${minLength} dígitos`
}
