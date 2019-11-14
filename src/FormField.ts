import { ValidatorFunction, Form } from ".";
import { computed, reaction, observable, action } from "mobx";

export class FormField<T = any> {
    @observable private _initialValue: T;
    @observable public value: T;
    @observable public validators: ValidatorFunction<T>[] | undefined;
    @observable private _isTouched: boolean = false;
    @observable private _errorMessages: string[] | undefined = undefined;
    @observable private _isValid: boolean = false;
    @observable private _isEnabled: boolean = true;

    constructor(value: T, form: () => Form, validators?: ValidatorFunction<T>[]) {
        this._initialValue = value;
        this.value = value;
        this.validators = validators;

        this.validateField(value, form);
        reaction(() => this.value, (value) => this.validateField(value, form))
    }

    protected validateField(value: T, form: () => Form) {
        if (this.validators) {
            this._errorMessages = []
            for (const validator of this.validators) {
                var errorMessage = validator(value, form);
                if (errorMessage) {
                    this._errorMessages.push(errorMessage);
                    this._isValid = false;
                } else {
                    this._isValid = this._errorMessages.length > 0 ? false : true;
                }
            }
        } else {
            this._isValid = true;
        }
    }

    @action disable() {
        this._isEnabled = false;
    }

    @action enable() {
        this._isEnabled = true;
    }

    @action reset() {
        this.value = this._initialValue;
    }

    set isTouched(value: boolean) {
        this._isTouched = value;
    }

    @computed get isTouched() {
        return this._isTouched;
    }

    @computed get isEnabled() {
        return this._isEnabled;
    }

    @computed get isFieldValid() {
        return this._isValid;
    }

    @computed get errorMessages() {
        return this._errorMessages;
    }

}