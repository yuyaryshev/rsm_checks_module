import type { GenericValidator } from "../../validator_types";
import type { ServiceApiEnv } from "../ServiceApiEnv";

export type GenericApiImpl = (env: ServiceApiEnv) => void;

// @INPRINT_START {exclude:[""], merge:[{name:"validatorImpls:GenericApiImpl[]", suffix:"ApiImpl", asObject:false}]}
export * from "./updateValidators.js";
export * from "./validate.js";

import { updateValidatorsApiImpl } from "./updateValidators.js";
import { validateApiImpl } from "./validate.js";
export const validatorImpls: GenericApiImpl[] = [
  updateValidatorsApiImpl,
  validateApiImpl,
];
// @INPRINT_END

export function publishValidatorApis(env: ServiceApiEnv) {
  for (const validatorImpl of validatorImpls) {
    validatorImpl(env);
  }
}
