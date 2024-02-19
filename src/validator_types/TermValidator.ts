import type { GenericValidatorFunc } from "./GenericValidatorFunc";
import type { ValidationError } from "./ValidationError";
import type { Term } from "../rsm_types";
import type { GenericValidator } from "./GenericValidator.js";

export type TermValidatorFunc = (obj: Term, errors: ValidationError[]) => void | Promise<void>;
export interface TermValidator extends GenericValidator {
    validatorType: "Term";
    validatorFunc: TermValidatorFunc;
}
