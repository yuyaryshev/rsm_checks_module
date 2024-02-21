import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import type { System } from "../rsm_types/index.js";

export const activeSystemValidator: SystemValidator = {
    validatorId: "c51c37b8-c8a2-4087-b35f-f8826234dbdd",
    validatorType: "System",
    validatorSets: ["before_vision_approval"],
    name: "Чисто активные системы",
    description: "Чисто активные системы не могут принимать вызовы, - могут только осуществлять их. Пример: Informatica power center",
    validatorFunc: (sys: System, errors: ValidationError[]) => {
        if (sys.flags.includes("pure_active")) {
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
