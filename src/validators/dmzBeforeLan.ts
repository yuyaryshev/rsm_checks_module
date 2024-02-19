import { IntegrationValidator, SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import { Integration, isChildSystemOf, System } from "../rsm_types/index.js";
import { isOneOf } from "../helperFuncs.js";

export const dmzBeforeLanValidator: IntegrationValidator = {
    validatorId: "add48106-b1c1-4d6f-b02b-e28e251fc2f2",
    validatorType: "Integration",
    name: "Чисто пассивные системы",
    description: "Чисто пассивные системы не могут никого вызывать, - могут только принимать вызовы. Примеры: базы данных, очереди, ElasticSearch",
    validatorFunc: (integration: Integration, errors: ValidationError[]) => {
        for (const integrationSide of integration.sides) {
            if (integrationSide.system.netSegment !== "WAN") {
                continue;
            }

            if (!isOneOf(integrationSide.otherSide.system.netSegment, "WAN", "DMZ")) {
                errors.push({
                    errorCode: "VE0006",
                    object: integration,
                });
            }
        }
    },
};
