import { object, string, number, array, anyJson, Decoder, optional, constant, oneOf } from "yuyaryshev-json-type-validation";
import { decoderRsmChangeState, RsmChangeState } from "./RsmChangeState.js";

export type RsmObjectId = string;
export const decoderRsmObjectId = string();

export interface RsmObject {
    id: RsmObjectId;
    type: string;

    name?: string;
    description?: string;
    changeState?: RsmChangeState;
}

export interface RsmObjectWithName extends RsmObject {
    name: string;
    description?: string;
    changeState: RsmChangeState;
}

export type RsmObjectType = "Term" | "System" | "Port" | "Interface" | "Integration" | "IntegrationSide";
export const decoderRsmObjectType: Decoder<RsmObjectType> = oneOf<RsmObjectType>(
    constant("Term"),
    constant("System"),
    constant("Port"),
    constant("Interface"),
    constant("Integration"),
    constant("IntegrationSide"),
);

export const decoderARGRsmObject = {
    id: decoderRsmObjectId,
    type: string(),
    name: optional(string()),
    description: optional(string()),
    changeState: optional(decoderRsmChangeState),
};

export const decoderARGRsmObjectWithName = {
    ...decoderARGRsmObject,
    type: string(),
    name: string(),
    description: optional(string()),
    changeState: decoderRsmChangeState,
};
export const decoderRsmObjectRef = (rsmObjectType: RsmObjectType | "any"): Decoder<any> => {
    if (rsmObjectType === "any") {
        return object({
            id: string(),
        });
    }
    return object({
        id: string(), //constant(rsmObjectType),
    });
};

export interface RsmObjectSearchById {
    id: RsmObjectId;
    name?: string;
}
export interface RsmObjectSearchByName {
    id?: undefined;
    name: string;
}
export type RsmObjectSearch = RsmObjectSearchById | RsmObjectSearchByName;
