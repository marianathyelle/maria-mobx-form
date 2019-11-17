import { Form } from "./Form";

export type ValidatorFunction<T> = (
  value: T,
  form: () => Form
) => string | undefined;

export type AsyncValidatorFunction<T> = (
  value: T,
  form: () => Form
) => Promise<string | undefined>;
