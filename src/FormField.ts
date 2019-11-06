import { ValidatorFunction, Form } from ".";
import { computed, reaction, observable } from "mobx";

export class FormField<T = any> {
    @observable public value: T;
    @observable public validators: ValidatorFunction<T>[] | undefined;
    @observable private _isTouched: boolean = false;
    @observable private _errorMessages: string[] | undefined = undefined;
    @observable private _isValid: boolean = false;

    constructor(value: T, validators?: ValidatorFunction<T>[]) {
        this.value = value;
        this.validators = validators;

        this.validateField(value);
        reaction(() => this.value, (value) => this.validateField(value))
    }

    protected validateField(value: T) {
        if (this.validators) {
            this._errorMessages = []
            for (const validator of this.validators) {
                var errorMessage = validator(value);
                if (errorMessage) {
                    this._errorMessages.push(errorMessage);
                    this._isValid = false;
                } else {
                    this._isValid = this._errorMessages.length > 0 ? false : true;
                }
            }
        }
    }

    set isTouched(value: boolean) {
        this._isTouched = value;
    }

    @computed get isTouched() {
        return this._isTouched;
    }

    @computed get isFieldValid() {
        return this._isValid;
    }

    @computed get errorMessages() {
        return this._errorMessages;
    }

}