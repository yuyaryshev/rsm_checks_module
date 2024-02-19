import { httpApiDefinition, httpApiFunction } from "yhttp_api";
import { object, string, number, array, anyJson } from "yuyaryshev-json-type-validation";
import { decoderValidationErrorFlattened, flattenValidationError, ValidationError, ValidationErrorFlattened } from "../../validator_types/index.js";
import { implementHttpExpressApi } from "yhttp_api_express";
import { reconstructObjectsArray, updateValidatorsApi } from "../../api/index.js";
import type { ServiceApiEnv } from "../ServiceApiEnv.js";
import { validatorsMap } from "../../validators/index.js";
import { a } from "vite/dist/node/types.d-jgA8ss1A";
import { deserializeValidator } from "../../deserializeValidator.js";

export function updateValidatorsApiImpl(env: ServiceApiEnv) {
    implementHttpExpressApi(
        env.apiRoot,
        updateValidatorsApi,
        async (req: typeof updateValidatorsApi.request): Promise<typeof updateValidatorsApi.response> => {
            console.warn(`CODE00000005 CURRENT_DEBUG updateValidatorsApi called!`);

            const errors: ValidationErrorFlattened[] = [];

            for (const serializedValidator of req.validators) {
                try {
                    const deserializedValidator = deserializeValidator(serializedValidator);
                    if (deserializedValidator === "DELETE") {
                        validatorsMap.delete(serializedValidator.validatorId);
                    } else {
                        validatorsMap.set(serializedValidator.validatorId, deserializedValidator);
                    }
                } catch (e: any) {
                    errors.push({
                        errorCode: "VE9003",
                        objectId: undefined,
                        additionalMessage: e.stack,
                    });
                }
            }

            const r: typeof updateValidatorsApi.response = { errors };
            return r;
        },
    );
}
