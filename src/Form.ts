import { observable } from 'mobx';
import { FormField, Validators } from './Interfaces';

export class Form {
    @observable isSubmiting: boolean = false;
    @observable fields: Record<string, FormField>

    onSubmit: (fields: Record<string, FormField>) => Promise<any>

    constructor(fields: Record<string, FormField>, onSubmit: (fields: Record<string, FormField>) => Promise<any> ) {
        this.fields = observable(fields)
        this.onSubmit = onSubmit
    }

    public validation<T>(value: T, field: FormField<T>, validators: Validators<T>[]) {
        validators.forEach(item => item.validator(value, field))
    }

    public isValid(){
        const invalidFields = Object.keys(this.fields).filter((key) => this.fields[key].isValid === false);
        if (invalidFields) {
            invalidFields.forEach(key => {
                const fieldValue = this.fields[key].value;
                if (fieldValue && fieldValue.length === this.fields[key].minLength) {
                    this.fields[key].helpMessage = `${key} inválido(a)`
                } else {
                    this.fields[key].helpMessage = 'Campo obrigatório'
                }
            })
        } 

        return invalidFields.length > 0 ? false : true;
    }

    public async submit(){
        if(this.isValid()){
            try {
                this.isSubmiting = true
                await this.onSubmit(this.fields)
            } catch (error) {
                this.isSubmiting = false
            } finally {
                this.isSubmiting = false
            }
        }
    }
}

