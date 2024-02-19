import type { ValidationError } from "./ValidationError";

export type GenericValidatorFunc = (obj: any, errors: ValidationError[]) => void | Promise<void>;
