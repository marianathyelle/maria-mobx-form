import { observable, reaction, computed, action } from 'mobx';
import { FormField } from './FormField';

export class Form  {
    @observable public isSubmiting: boolean = false;
    @observable public fields: Record<string, FormField>
    @observable private _isFormValid: boolean = false;
    @observable private _error: boolean = false;
    @observable onSubmit: (fields: Record<string, FormField>) => Promise<any>;

    constructor(fields: Record<string, FormField>, onSubmit: (fields: Record<string, FormField>) => Promise<any>) {
        this.fields = observable(fields)
        this.onSubmit = onSubmit
    }

    private validateForm() {
        var _isValid = true
        let enabledFields = Object.keys(this.fields).filter(key => this.fields[key].isEnabled)
        for (const key in enabledFields) {
            if (enabledFields.hasOwnProperty(key)) {
                const field = this.fields[enabledFields[key]];
                if(!field.isFieldValid){
                    _isValid = false
                    continue
                }
            }
        }
        this._isFormValid = _isValid
        return _isValid
    }

    public async submit() {
        if (this.validateForm()) {
            this.isSubmiting = true
            try {
                await this.onSubmit(this.fields)
            } catch (error) {
                this._error = true;
            } finally {
                this.isSubmiting = false
            }
        }
    }

    @computed get isFormValid() {
        return this._isFormValid;
    }

    @computed get error() {
        return this._error;
    }

    @action reset() {
       Object.keys(this.fields).map(key => this.fields[key].reset())
    }
}

