import type { GenericValidator } from "../validator_types";

// @INPRINT_START {exclude:["projmeta"], merge:[{name:"embeddedValidators:GenericValidator[]", suffix:"Validator"}]}
export * from "./activeSystem.js";
export * from "./arcsite.js";
export * from "./cl2.js";
export * from "./deprecatedSystem.js";
export * from "./dmzBeforeLan.js";
export * from "./lockedSystem.js";
export * from "./passiveSystem.js";
export * from "./signModule.js";

import { activeSystemValidator } from "./activeSystem.js";
import { arcsiteValidator } from "./arcsite.js";
import { cl2Validator } from "./cl2.js";
import { deprecatedSystemValidator } from "./deprecatedSystem.js";
import { dmzBeforeLanValidator } from "./dmzBeforeLan.js";
import { lockedSystemValidator } from "./lockedSystem.js";
import { passiveSystemValidator } from "./passiveSystem.js";
import { signModuleValidator } from "./signModule.js";
export const embeddedValidators: GenericValidator[] = [
  activeSystemValidator,
  arcsiteValidator,
  cl2Validator,
  deprecatedSystemValidator,
  dmzBeforeLanValidator,
  lockedSystemValidator,
  passiveSystemValidator,
  signModuleValidator,
];
// @INPRINT_END

export const validatorsMap: Map<string | number, GenericValidator> = new Map<
  string | number,
  GenericValidator
>(embeddedValidators.map((v) => [v.validatorId, v]));
