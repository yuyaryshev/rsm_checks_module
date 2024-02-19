// import type {Integration} from "./Integration.js";
import type { Interface } from "./Interface.js";
import type { Port } from "./Port.js";
import type { System } from "./System.js";
import type { Term } from "./Term.js";
import type { RsmObjectWithName, RsmObjectId, RsmObject } from "./RsmObject.js";
import type { RsmChangeState } from "./RsmChangeState.js";
import { constant, Decoder, object } from "yuyaryshev-json-type-validation";
import { decoderARGRsmObject, decoderARGRsmObjectWithName, decoderRsmObjectRef } from "./RsmObject.js";
import { pushNewValues } from "../pushNewValues.js";
import { InterfacePoor } from "./Interface.js";
import { a } from "vite/dist/node/types.d-jgA8ss1A";

export interface IntegrationSidePoor extends RsmObject {
    type: "IntegrationSide";
    ifc: Interface;
    integration: Integration;
}
export function IntegrationSide_normalizeLinks(intSide: IntegrationSidePoor) {}

export const decoderIntegrationSidePoor: Decoder<IntegrationSidePoor> = object({
    ...decoderARGRsmObject,
    type: constant("IntegrationSide"),

    ifc: decoderRsmObjectRef("Interface"),
    integration: decoderRsmObjectRef("Integration"),
});

export interface IntegrationSide extends IntegrationSidePoor {
    // Enriched attributes
    system: System;
    port: Port;
    term: Term;
    otherSide: IntegrationSide;
}

export interface IntegrationPoor extends RsmObjectWithName {
    type: "Integration";

    source: IntegrationSide;
    target: IntegrationSide;
}
export function Integration_normalizeLinks(integration: IntegrationPoor) {
    integration.source.integration = integration as any;
    integration.target.integration = integration as any;
}

export const decoderIntegrationPoor: Decoder<IntegrationPoor> = object({
    ...decoderARGRsmObjectWithName,
    type: constant("Integration"),

    source: decoderRsmObjectRef("IntegrationSide"),
    target: decoderRsmObjectRef("IntegrationSide"),
});

export interface Integration extends IntegrationPoor {
    // Enriched attributes
    sides: IntegrationSide[];
}
