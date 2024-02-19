import type { GenericValidatorFunc } from "./GenericValidatorFunc";
import type { ValidationError } from "./ValidationError";
import type { IntegrationSide } from "../rsm_types";
import type { GenericValidator } from "./GenericValidator.js";

export type IntegrationSideValidatorFunc = (obj: IntegrationSide, errors: ValidationError[]) => void | Promise<void>;
export interface IntegrationSideValidator extends GenericValidator {
    validatorType: "IntegrationSide";
    validatorFunc: IntegrationSideValidatorFunc;
}
