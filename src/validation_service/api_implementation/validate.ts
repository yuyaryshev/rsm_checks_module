import { httpApiDefinition, httpApiFunction } from "yhttp_api";
import { object, string, number, array, anyJson } from "yuyaryshev-json-type-validation";
import {
    decoderValidationErrorFlattened,
    flattenValidationError,
    ValidationError,
    ValidationErrorCode,
    ValidationErrorFlattened,
} from "../../validator_types/index.js";
import { implementHttpExpressApi } from "yhttp_api_express";
import { reconstructObjectsArray, validateApi } from "../../api/index.js";
import type { ServiceApiEnv } from "../ServiceApiEnv.js";
import { validatorsMap } from "../../validators/index.js";
import { decoderAllowedRsmObject, decoderByObjectType } from "../../rsm_types/decoderRsmObject.js";
import { enrichData, RsmObject, RsmObjectWithName } from "../../rsm_types/index.js";

export interface InvalidApiCallError extends ValidationErrorFlattened {}

function validateRawObject(rawObject: any) {
    if (!rawObject.type) {
        throw new Error(`CODE00000000 В объекте id=${rawObject.id || "undefined"} отсутствует поле type!`);
    }
    const decoder = (decoderByObjectType as any)[rawObject.type];
    if (!decoder) {
        throw new Error(`CODE00000000 Тип объекта не поддерживается сервисом type=${rawObject.type}, id=${rawObject.id || "undefined"}!`);
    }

    decoder.runWithException(rawObject);
}

function dedublicateErrors(errors: ValidationErrorFlattened[]): ValidationErrorFlattened[] {
    const errorsAgg: { [key: string]: { [key: string]: ValidationErrorFlattened } } = {};
    for (const e of errors) {
        if (!errorsAgg[e.objectId]) {
            errorsAgg[e.objectId] = {};
        }
        const existingErr = errorsAgg[e.objectId][e.errorCode];
        if (!existingErr) {
            errorsAgg[e.objectId][e.errorCode] = e;
        } else {
            if (existingErr.additionalMessage !== e.additionalMessage) {
                if (existingErr.additionalMessage && e.additionalMessage) {
                    existingErr.additionalMessage = `${existingErr.additionalMessage || ""}; ${e.additionalMessage}`;
                } else {
                    existingErr.additionalMessage = existingErr.additionalMessage || e.additionalMessage;
                }
            }
        }
    }

    const r: ValidationErrorFlattened[] = [];
    for (let k1 in errorsAgg) {
        for (let k2 in errorsAgg[k1]) {
            r.push(errorsAgg[k1][k2]);
        }
    }
    return r;
}

export function validateApiImpl(env: ServiceApiEnv) {
    implementHttpExpressApi(env.apiRoot, validateApi, async (req: typeof validateApi.request): Promise<typeof validateApi.response> => {
        console.warn(`CODE00000006 CURRENT_DEBUG validateApi called!`);

        const invalidApiCallErrors: InvalidApiCallError[] = [];
        for (const rawObject of req.objects) {
            try {
                validateRawObject(rawObject);
            } catch (e: any) {
                invalidApiCallErrors.push({
                    errorCode: "VE9001",
                    objectId: rawObject.id,
                    additionalMessage: e.message,
                });
            }
        }
        if (invalidApiCallErrors.length) {
            const r: typeof validateApi.response = { errors: invalidApiCallErrors };
            return r;
        }

        const reconstructedObjectsArray = reconstructObjectsArray(req.objects);

        enrichData(req.objects);

        const errors0: ValidationError[] = [];
        for (const obj of reconstructedObjectsArray) {
            for (const [validatorId, validator] of validatorsMap) {
                try {
                    await validator.validatorFunc(obj, errors0);
                } catch (e: any) {
                    const ve: ValidationError = {
                        errorCode: "VE9002",
                        object: obj,
                        additionalMessage: e.status,
                    };
                    errors0.push();
                }
            }
        }

        const flattenedErrors = errors0.map(flattenValidationError);
        const dedublicatedErrors = dedublicateErrors(flattenedErrors);
        const errors = dedublicatedErrors;

        const r: typeof validateApi.response = { errors };
        return r;
    });
}
