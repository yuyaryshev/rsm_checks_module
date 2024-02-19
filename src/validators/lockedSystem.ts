import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import type { System } from "../rsm_types/index.js";

export const lockedSystemValidator: SystemValidator = {
    validatorId: "d9bb4719-8c98-4d03-bfd2-e7ba58d4b703",
    validatorType: "System",
    name: "Чисто пассивные системы",
    description: "Чисто пассивные системы не могут никого вызывать, - могут только принимать вызовы. Примеры: базы данных, очереди, ElasticSearch",
    validatorFunc: (sys: System, errors: ValidationError[]) => {
        if (sys.flags.includes("locked_ports")) {
            for (const port of sys.ports) {
                if (port.changeState !== "unchanged") {
                    errors.push({
                        errorCode: "VE0004",
                        object: port,
                    });
                }
            }
        }

        if (sys.flags.includes("locked_interfaces") || sys.flags.includes("locked_ports")) {
            for (const ifc of sys.interfaces) {
                if (ifc.changeState !== "unchanged") {
                    errors.push({
                        errorCode: "VE0004",
                        object: ifc,
                    });
                }
            }
        }
    },
};
