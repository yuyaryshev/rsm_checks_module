import type { Integration, IntegrationSide } from "./Integration.js";
import type { Interface } from "./Interface.js";
// import type {Port} from "./Port.js";
import type { System } from "./System.js";
import type { Term } from "./Term.js";
import type { RsmObjectWithName } from "./RsmObject.js";
import type { RsmChangeState } from "./RsmChangeState.js";
import { array, boolean, constant, Decoder, object, optional } from "yuyaryshev-json-type-validation";
import { decoderARGRsmObjectWithName, decoderRsmObjectRef } from "./RsmObject.js";
import { InterfacePoor } from "./Interface.js";
import { SystemPoor } from "./System.js";
import { pushNewValues } from "../pushNewValues.js";

export interface PortPoor extends RsmObjectWithName {
    type: "Port";

    system: System;
    term: Term;
    interfaces: Interface[];
}
export function Port_normalizeLinks(port: PortPoor) {
    pushNewValues(port.system, "ports", port as any);
    for (const ifc of port.interfaces) {
        ifc.port = port as any;
    }
}

export const decoderPortPoor: Decoder<PortPoor> = object({
    ...decoderARGRsmObjectWithName,
    type: constant("Port"),

    system: decoderRsmObjectRef("System"),
    term: optional(decoderRsmObjectRef("Term")),
    interfaces: array(decoderRsmObjectRef("Interface")),
});

export interface Port extends PortPoor {
    // Enriched attributes
    integrations: Integration[];
    integrationSides: IntegrationSide[];
}
