import { ValidatorFunction, Form } from ".";
import { computed, reaction, observable, action } from "mobx";
import { AsyncValidatorFunction } from "./ValidatorFunction";

export class FormField<T = any> {
  @observable private _initialValue: T;
  @observable public value: T;
  @observable private validators: ValidatorFunction<T>[] | undefined;
  @observable private asyncValidators: AsyncValidatorFunction<T>[] | undefined;
  @observable private _isTouched: boolean = false;
  @observable private _errorMessages: string[] | undefined = undefined;
  @observable private _isValid: boolean = false;
  @observable private _isEnabled: boolean = true;
  @observable private _isValidating: boolean = false;

  constructor(
    value: T,
    form: () => Form,
    validators?: ValidatorFunction<T>[],
    asyncValidators?: AsyncValidatorFunction<T>[]
  ) {
    this._initialValue = value;
    this.value = value;
    this.validators = validators;
    this.asyncValidators = asyncValidators;

    this.validateField(value, form);
    reaction(
      () => this.value,
      value => this.validateField(value, form)
    );
  }

  protected validateField(value: T, form: () => Form) {
    if (this.validators) {
      this._errorMessages = [];
      for (const validator of this.validators) {
        var errorMessage = validator(value, form);
        if (errorMessage) {
          this._errorMessages.push(errorMessage);
          this._isValid = false;
        } else {
          this._isValid = this._errorMessages.length > 0 ? false : true;
        }
      }
    } else if (this.asyncValidators) {
      this._isValidating = true;
      this._errorMessages =
        this._errorMessages!.length == 0 ? this._errorMessages : [];
      for (const validator of this.asyncValidators) {
        validator(value, form).then(resp => {
          if (resp) {
            this._errorMessages!.push(resp);
            this._isValid = false;
          } else {
            this._isValid = this._errorMessages!.length == 0;
          }
        });
      }
      this._isValidating = false;
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

  @computed get isValidating() {
    return this._isValidating;
  }
}
