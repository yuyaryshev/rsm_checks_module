import type { Integration, IntegrationSide } from "./Integration.js";
// import type {Interface} from "./Interface.js";
import type { Port } from "./Port.js";
import type { System } from "./System.js";
import type { Term } from "./Term.js";
import type { RsmObjectWithName } from "./RsmObject.js";
import type { RsmChangeState } from "./RsmChangeState.js";
import { array, boolean, constant, Decoder, object } from "yuyaryshev-json-type-validation";
import { decoderARGRsmObjectWithName, decoderRsmObjectRef } from "./RsmObject.js";
import { IntegrationPoor } from "./Integration.js";
import { pushNewValues } from "../pushNewValues.js";
import { PortPoor } from "./Port.js";

export interface InterfacePoor extends RsmObjectWithName {
    type: "Interface";

    requester: boolean;
    port: Port;
    integrationSides: IntegrationSide[];
}
export function Interface_normalizeLinks(ifc: InterfacePoor) {
    pushNewValues(ifc.port, "interfaces", ifc as any);
    for (const intSide of ifc.integrationSides) {
        intSide.ifc = ifc as any;
    }
}

export const decoderInterfacePoor: Decoder<InterfacePoor> = object({
    ...decoderARGRsmObjectWithName,
    type: constant("Interface"),
    requester: boolean(),

    port: decoderRsmObjectRef("Port"),
    integrationSides: array(decoderRsmObjectRef("IntegrationSide")),
});

export interface Interface extends InterfacePoor {
    // Enriched attributes
    integrations: Integration[];
    system: System;
    term: Term;
}
