import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import { isChildSystemOf, System } from "../rsm_types/index.js";
import { globalApi } from "../globalApi.js";

export const arcsiteValidator: SystemValidator = {
    validatorId: "3663da09-120c-44c5-a7fe-68c1a5acda65",
    validatorType: "System",
    validatorSets: ["before_vision_approval"],
    name: "Чисто пассивные системы",
    description: "Чисто пассивные системы не могут никого вызывать, - могут только принимать вызовы. Примеры: базы данных, очереди, ElasticSearch",
    validatorFunc: async (sys: System, errors: ValidationError[]) => {
        if (!(await globalApi.hasIntegration(sys, { name: "ArcSite" }))) {
            errors.push({
                errorCode: "VE0007",
                object: sys,
            });
        }
    },
};
