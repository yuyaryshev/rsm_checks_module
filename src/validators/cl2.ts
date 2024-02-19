import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import { IntegrationSide, isChildSystemOf, RsmObjectSearch, System } from "../rsm_types/index.js";
import { IntegrationSideValidator } from "../validator_types/IntegrationSideValidator.js";
import { rsmSystemId } from "../helperFuncs.js";

function findIntegrations(sys: System, searchA: RsmObjectSearch, searchB: RsmObjectSearch): IntegrationSide[] {
    const r: IntegrationSide[] = [];
    if (isChildSystemOf(sys, searchA)) {
        for (const integrationSide of sys.integrationSides) {
            if (isChildSystemOf(integrationSide.system, searchA) && isChildSystemOf(integrationSide.otherSide.system, searchB)) {
                r.push(integrationSide);
            }
        }
    }
    return r;
}

export const cl2Validator: SystemValidator = {
    validatorId: "e746afab-b1e1-4b48-a2b7-24981839c9a8",
    validatorType: "System",
    name: "Должен присутствовать CL2, если есть Альфа-мобайл",
    description: "Должен присутствовать CL2, если есть Альфа-мобайл",
    validatorFunc: (sys: System, errors: ValidationError[]) => {
        const integrationSides = findIntegrations(sys, rsmSystemId("Альфа-мобайл"), rsmSystemId("CL2"));
        if (integrationSides.length) {
            if (
                !integrationSides.filter(
                    (intSide) => intSide.integration.name.includes("логирование") || intSide.otherSide.port.name.includes("логирование"),
                ).length
            ) {
                errors.push({
                    errorCode: "VE0008",
                    object: sys,
                });
            }
        }
    },
};
