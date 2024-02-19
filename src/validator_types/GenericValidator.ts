import type { ValidationError, ValidationErrorCode } from "./ValidationError";
import type { GenericValidatorFunc } from "./GenericValidatorFunc";
import { object, string, number, array, anyJson, oneOf, optional, Decoder, constant, boolean } from "yuyaryshev-json-type-validation";

export type ValidatorType = "Interface" | "Integration" | "IntegrationSide" | "Port" | "System" | "Term";
export const decoderValidatorType = oneOf<ValidatorType>(
    constant("Interface"),
    constant("Integration"),
    constant("IntegrationSide"),
    constant("Port"),
    constant("System"),
    constant("Term"),
);

export const decoderFIELDS_GenericValidatorHeader = {
    validatorId: oneOf<string | number>(string(), number()),
    validatorType: decoderValidatorType,
    name: string(),
    description: optional(string()),
};

export interface GenericValidatorHeader {
    validatorId: string | number;
    validatorType: ValidatorType;
    name: string;
    description?: string;
}
export const decoderGenericValidatorHeader: Decoder<GenericValidatorHeader> = object(decoderFIELDS_GenericValidatorHeader);

export interface GenericValidator extends GenericValidatorHeader {
    validatorFunc: GenericValidatorFunc;
}

export interface SerializedValidator extends GenericValidatorHeader {
    validatorSourceCode: string;
    deleteFlag?: boolean;
}

export const decoderSerializedValidator: Decoder<SerializedValidator> = object({
    //
    ...decoderFIELDS_GenericValidatorHeader,
    validatorSourceCode: string(),
    deleteFlag: optional(boolean()),
});
