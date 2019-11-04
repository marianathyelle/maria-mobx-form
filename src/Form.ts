import { observable, reaction } from 'mobx';
import { FormField } from './Interfaces';

export class Form {
    @observable isSubmiting: boolean = false;
    @observable fields: Record<string, FormField>
    @observable isValid: boolean = false
    onSubmit: (fields: Record<string, FormField>) => Promise<any>

    constructor(fields: Record<string, FormField>, onSubmit: (fields: Record<string, FormField>) => Promise<any>) {
        this.fields = observable(fields)
        for (const key in this.fields) {
            if (this.fields.hasOwnProperty(key)) {
                const field = this.fields[key];
                reaction(() => field, (field) => this.validateForm(field))
            }
        }
        this.onSubmit = onSubmit
    }

    protected validateForm(field: FormField<any>) {
        if (field.validators) {
            field.errorMessage = []
            for (const validator of field.validators) {
                var errorMessage = validator(field.value);
                if (errorMessage) {
                    field.errorMessage.push(errorMessage);
                }
            }
        }
    }

    private _isValid(){
        var isValid = true
        for (const key in this.fields) {
            if (this.fields.hasOwnProperty(key)) {
                const field = this.fields[key];
                if(field.errorMessage && field.errorMessage.length > 0){
                    isValid = false
                    continue
                }
            }
        }
        this.isValid = isValid
        return isValid
    }

    public async submit() {
        if (this._isValid()) {
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

