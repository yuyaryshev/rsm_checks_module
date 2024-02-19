import type { GenericValidatorFunc } from "./GenericValidatorFunc";
import type { ValidationError } from "./ValidationError";
import type { System } from "../rsm_types";
import type { GenericValidator } from "./GenericValidator.js";

export type SystemValidatorFunc = (obj: System, errors: ValidationError[]) => void | Promise<void>;
export interface SystemValidator extends GenericValidator {
    validatorType: "System";
    validatorFunc: SystemValidatorFunc;
}
