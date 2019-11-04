export interface FormField<T=any> {
    value: T;
    isValid: boolean;
    minLength?: number;
    errorMessage: string[]; 
    validators?: ValidatorFunction<T>[]
}

export type ValidatorFunction<T> = (value: T) => string | undefined