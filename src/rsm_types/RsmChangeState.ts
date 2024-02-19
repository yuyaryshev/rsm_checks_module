import { oneOf, constant, Decoder, string } from "yuyaryshev-json-type-validation";
import { a } from "vite/dist/node/types.d-jgA8ss1A";

export type RsmChangeState = "deleted" | "unchanged" | "changed" | "new";
export const decoderRsmChangeState1: Decoder<RsmChangeState> = string() as any;
export const decoderRsmChangeState: Decoder<RsmChangeState> = oneOf<RsmChangeState>(
    constant("deleted"),
    constant("unchanged"),
    constant("changed"),
    constant("new"),
);
