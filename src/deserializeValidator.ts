import type { GenericValidator, GenericValidatorFunc, SerializedValidator } from "./validator_types";
import * as BabelJs from "@babel/core";

function compileSourceCode(sourceCode: string): string {
    const babelOptions = {
        presets: ["@babel/preset-typescript"],
    };

    const { code } = BabelJs.transformSync(sourceCode, babelOptions) || { code: "" };
    if (!code) {
        throw new Error(
            `CODE00000004 BabelJs failed to compile validator code! It also didn't provided any specific error for it, failure the reason is unknown!`,
        );
    }
    return code;
}

export function deserializeValidator(serializedValidator: SerializedValidator): GenericValidator | "DELETE" {
    const { validatorSourceCode, deleteFlag, ...validatorHeader } = serializedValidator;
    if (deleteFlag) {
        return "DELETE";
    }

    const compiledSourceCode: string = compileSourceCode(validatorSourceCode);
    const validatorFunc: GenericValidatorFunc = new Function("obj", "errors", compiledSourceCode) as any;

    const r: GenericValidator = { ...validatorHeader, validatorFunc };
    return r;
}
