import type { GenericValidatorFunc } from "./GenericValidatorFunc";
import type { ValidationError } from "./ValidationError";
import type { Integration } from "../rsm_types";
import type { GenericValidator } from "./GenericValidator.js";

export type IntegrationValidatorFunc = (obj: Integration, errors: ValidationError[]) => void | Promise<void>;
export interface IntegrationValidator extends GenericValidator {
    validatorType: "Integration";
    validatorFunc: IntegrationValidatorFunc;
}
