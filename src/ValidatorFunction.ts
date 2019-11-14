import { Form } from "./Form";

export type ValidatorFunction<T> = (value: T, form: () => Form) => string | undefined