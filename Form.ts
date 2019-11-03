import { observable } from 'mobx';
import { FormField, Validators } from './Interfaces';

export class Form {

    @observable isSubmiting: boolean = false;

    @observable fields: FormField[]

    onSubmit: (fields: FormField[]) => Promise<any>

    constructor(fields: FormField[], onSubmit: (fields: FormField[]) => Promise<any> ) {
        this.fields = observable(fields)
        this.onSubmit = onSubmit
    }

    public validation<T>(value: T, field: FormField<T>, validators: Validators<T>[]) {
        validators.forEach(item => item.validator(value, field))
    }

    public isValid(){
        const invalidFields = this.fields.filter(element => element.isValid === false);
        return !invalidFields ? true : false;
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

