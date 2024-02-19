import { httpApiDefinition, httpApiFunction } from "yhttp_api";
import { object, string, number, array, anyJson } from "yuyaryshev-json-type-validation";
import { decoderValidationErrorFlattened, flattenValidationError, ValidationError, ValidationErrorFlattened } from "../../validator_types/index.js";
import { implementHttpExpressApi } from "yhttp_api_express";
import { reconstructObjectsArray, validateApi } from "../../api/index.js";
import type { ServiceApiEnv } from "../ServiceApiEnv.js";
import { validatorsMap } from "../../validators/index.js";
import { decoderAllowedRsmObject } from "../../rsm_types/decoderRsmObject.js";

export interface InvalidApiCallError extends ValidationErrorFlattened {}

export function validateApiImpl(env: ServiceApiEnv) {
    implementHttpExpressApi(env.apiRoot, validateApi, async (req: typeof validateApi.request): Promise<typeof validateApi.response> => {
        console.warn(`CODE00000006 CURRENT_DEBUG validateApi called!`);

        const invalidApiCallErrors: InvalidApiCallError[] = [];
        for (const rawObject of req.objects) {
            try {
                decoderAllowedRsmObject.runWithException(rawObject);
            } catch (e: any) {
                invalidApiCallErrors.push({
                    errorCode: "VE9001",
                    objectId: rawObject.id,
                    additionalMessage: e.message,
                });
            }
        }
        if (invalidApiCallErrors) {
            const r: typeof validateApi.response = { errors: invalidApiCallErrors };
            return r;
        }

        const reconstructedObjectsArray = reconstructObjectsArray(req.objects);

        const errors: ValidationError[] = [];
        for (const obj of reconstructedObjectsArray) {
            for (const [validatorId, validator] of validatorsMap) {
                try {
                    await validator.validatorFunc(obj, errors);
                } catch (e: any) {}
            }
        }

        const r: typeof validateApi.response = { errors: errors.map(flattenValidationError) };
        return r;
    });
}
