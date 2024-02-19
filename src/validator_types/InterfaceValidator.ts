import type { GenericValidatorFunc } from "./GenericValidatorFunc";
import type { ValidationError } from "./ValidationError";
import type { Interface } from "../rsm_types";
import type { GenericValidator } from "./GenericValidator";

export type InterfaceValidatorFunc = (obj: Interface, errors: ValidationError[]) => void | Promise<void>;
export interface InterfaceValidator extends GenericValidator {
    validatorType: "Interface";
    validatorFunc: InterfaceValidatorFunc;
}
