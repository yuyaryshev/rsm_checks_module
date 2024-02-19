import type { GenericValidatorFunc } from "./GenericValidatorFunc";
import type { ValidationError } from "./ValidationError";
import type { Port } from "../rsm_types";
import type { GenericValidator } from "./GenericValidator.js";

export type PortValidatorFunc = (obj: Port, errors: ValidationError[]) => void | Promise<void>;
export interface PortValidator extends GenericValidator {
    validatorType: "Port";
    validatorFunc: PortValidatorFunc;
}
