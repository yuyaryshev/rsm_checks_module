import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import { isChildSystemOf, System } from "../rsm_types/index.js";
import { rsmSystemId } from "../helperFuncs.js";

export const signModuleValidator: SystemValidator = {
    validatorId: "2e5d8393-b3fc-4917-aa4c-b3b0e0c3d3d5",
    validatorType: "System",
    validatorSets: ["before_vision_approval"],
    name: "SignModule можно интегрировать только с НИБ",
    description: "SignModule можно интегрировать только с НИБ",
    validatorFunc: (sys: System, errors: ValidationError[]) => {
        if (sys.name === "SignModule") {
            for (const integration of sys.integrations) {
                for (const integrationSide of integration.sides) {
                    if (isChildSystemOf(integrationSide.system, rsmSystemId("SignModule", "sysid_SignModule"))) {
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
