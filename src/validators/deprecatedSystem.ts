import type { SystemValidator, SystemValidatorFunc, ValidationError } from "../validator_types/index.js";
import type { System } from "../rsm_types/index.js";

export const deprecatedSystemValidator: SystemValidator = {
    validatorId: "04719dee-c207-41e0-8421-48c376e84df2",
    validatorType: "System",
    name: "Deprecated system",
    description: "Deprecated system - система под вывод - нельзя дорабатывать",
    validatorFunc: (sys: System, errors: ValidationError[]) => {
        if (sys.flags.includes("deprecated") && sys.changeState !== "unchanged") {
            errors.push({
                errorCode: "VE0003",
                object: sys,
            });
        }
    },
};
