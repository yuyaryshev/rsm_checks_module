import { anyJson, array, Decoder, object, oneOf, optional, string } from "yuyaryshev-json-type-validation";
import { decoderSystemPoor, SystemPoor } from "./System.js";
import { decoderPortPoor, PortPoor } from "./Port.js";
import { decoderTermPoor, TermPoor } from "./Term.js";
import { decoderInterfacePoor, InterfacePoor } from "./Interface.js";
import { decoderIntegrationPoor, IntegrationPoor, IntegrationSide, IntegrationSidePoor, decoderIntegrationSidePoor } from "./Integration.js";
import { decoderARGRsmObject, decoderARGRsmObjectWithName, decoderRsmObjectId } from "./RsmObject.js";
import { decoderRsmChangeState } from "./RsmChangeState.js";

export type AllowedRsmObject = SystemPoor | PortPoor | TermPoor | InterfacePoor | IntegrationPoor | IntegrationSidePoor;

export const decoderAllowedRsmObject: Decoder<AllowedRsmObject> = oneOf<AllowedRsmObject>(
    decoderSystemPoor,
    decoderPortPoor,
    decoderTermPoor,
    decoderInterfacePoor,
    decoderIntegrationPoor,
    decoderIntegrationSidePoor,
);
