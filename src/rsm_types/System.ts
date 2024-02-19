import type { Integration, IntegrationSide } from "./Integration.js";
import type { Interface } from "./Interface.js";
import type { Port } from "./Port.js";
// import type {System} from "./System.js";
import type { Term } from "./Term.js";
import type { RsmObjectWithName, RsmObjectSearch } from "./RsmObject.js";
import type { RsmChangeState } from "./RsmChangeState.js";
import { pushNewValues } from "../pushNewValues.js";
import { array, constant, Decoder, object, oneOf, optional } from "yuyaryshev-json-type-validation";
import { decoderARGRsmObjectWithName, decoderRsmObjectRef } from "./RsmObject.js";
import { PortPoor } from "./Port.js";

export type SystemFlag = "pure_passive" | "pure_active" | "deprecated" | "locked_ports" | "locked_interfaces";
export const decoderSystemFlag: Decoder<SystemFlag> = oneOf<SystemFlag>(
    constant("pure_passive"),
    constant("pure_active"),
    constant("deprecated"),
    constant("locked_ports"),
    constant("locked_interfaces"),
);

export type SystemNetSegment = "WAN" | "LAN" | "DMZ" | "PVLAN" | "MIXED";
export const decoderSystemNetSegment: Decoder<SystemNetSegment> = oneOf<SystemNetSegment>(
    constant("WAN"),
    constant("LAN"),
    constant("DMZ"),
    constant("PVLAN"),
    constant("MIXED"),
);

export interface SystemPoor extends RsmObjectWithName {
    type: "System";

    flags: SystemFlag[];
    netSegment: SystemNetSegment;
    parentSystem?: System;
    ports: Port[];
}
export const decoderSystemPoor: Decoder<SystemPoor> = object({
    ...decoderARGRsmObjectWithName,
    type: constant("System"),

    flags: array(decoderSystemFlag),
    netSegment: decoderSystemNetSegment,
    parentSystem: optional(decoderRsmObjectRef("System")),
    ports: array(decoderRsmObjectRef("Port")),
});

export interface System extends SystemPoor {
    // Enriched attributes
    interfaces: Interface[];
    integrations: Integration[];
    integrationSides: IntegrationSide[];
}

export function isChildSystemOf(child: System, parentNameOrId: RsmObjectSearch): boolean {
    let c: System | undefined = child;
    while (c) {
        if (c.name === parentNameOrId.id || c.id === parentNameOrId.name) {
            return true;
        }
        c = c.parentSystem;
    }
    return false;
}
