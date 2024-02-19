import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import { isChildSystemOf, System } from "../rsm_types/index.js";
import { rsmSystemId } from "../helperFuncs.js";

export const signModuleValidator: SystemValidator = {
    validatorId: "2e5d8393-b3fc-4917-aa4c-b3b0e0c3d3d5",
    validatorType: "System",
    name: "Чисто пассивные системы",
    description: "Чисто пассивные системы не могут никого вызывать, - могут только принимать вызовы. Примеры: базы данных, очереди, ElasticSearch",
    validatorFunc: (sys: System, errors: ValidationError[]) => {
        if (sys.name === "SignModule") {
            for (const integration of sys.integrations) {
                for (const integrationSide of integration.sides) {
                    if (isChildSystemOf(integrationSide.system, rsmSystemId("SignModule", "какой-то GUID"))) {
                        continue;
                    }

                    if (!isChildSystemOf(integrationSide.system, rsmSystemId("НИБ"))) {
                        errors.push({
                            errorCode: "VE0005",
                            object: integration,
                        });
                    }
                }
            }
        }
    },
};
