import type { Integration } from "./Integration.js";
import type { Interface } from "./Interface.js";
import type { Port } from "./Port.js";
import type { System } from "./System.js";
import type { RsmObjectWithName } from "./RsmObject.js";
import type { RsmChangeState } from "./RsmChangeState.js";
import { array, constant, Decoder, object, optional } from "yuyaryshev-json-type-validation";
import { decoderARGRsmObjectWithName, decoderRsmObjectRef } from "./RsmObject.js";
import { decoderSystemFlag, decoderSystemNetSegment, SystemPoor } from "./System.js";
// import type {Term} from "./Term.js";

export interface TermPoor extends RsmObjectWithName {
    type: "Term";
}

export interface Term extends TermPoor {}
export const decoderTermPoor: Decoder<TermPoor> = object({
    ...decoderARGRsmObjectWithName,
    type: constant("Term"),
});
