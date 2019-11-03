export interface FormField<T=any> {
    value: T;
    isValid: boolean;
    minLength?: number;
    infoMessage: string | undefined; 
    validation?: (value: T, field: FormField<T>) => void;
}

export interface Validators<T=any> {
    validator: (value: T, field: FormField<T>) => void;
}