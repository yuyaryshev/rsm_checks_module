import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import type { System } from "../rsm_types/index.js";

export const passiveSystemValidator: SystemValidator = {
    validatorId: "e84c3f3c-57ea-4c93-bb67-34c6d0768c39",
    validatorType: "System",
    validatorSets: ["before_vision_approval"],
    name: "Чисто пассивные системы",
    description: "Чисто пассивные системы не могут никого вызывать, - могут только принимать вызовы. Примеры: базы данных, очереди, ElasticSearch",
    validatorFunc: (sys: System, errors: ValidationError[]) => {
        if (sys.flags.includes("pure_passive")) {
            for (const ifc of sys.interfaces) {
                if (ifc.requester) {
                    errors.push({
                        errorCode: "VE0001",
                        object: ifc,
                    });
                }
            }
        }
    },
};
