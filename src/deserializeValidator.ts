import type { GenericValidator, GenericValidatorFunc, SerializedValidator } from "./validator_types";
import * as BabelJs from "@babel/core";
import { envFuncs, isOneOf, rsmSystemId } from "./helperFuncs.js";

function compileSourceCode(sourceCode: string, validatorNameOrId: string): string {
    const babelOptions = {
        filename: `validator.ts`,
        presets: ["@babel/preset-typescript"],
        parserOpts: { plugins: ["@babel/transform-typescript"] },
        plugins: [
            [
                "inline-replace-variables",
                {
                    INLINE_REPLACE_EXAMPLE: 0,
                },
            ],
            "@babel/transform-typescript",
        ],
    };

    const { code } = BabelJs.transformSync(sourceCode, babelOptions as any) || { code: "" };
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

    const compiledSourceCode: string = compileSourceCode(
        validatorSourceCode,
        validatorHeader.name || validatorHeader.validatorId + "" || "no_validator_name",
    );

    const getValidatorFunc: any = new Function(
        "envFuncs",
        `
    const {${Object.keys(envFuncs).join(", ")}} = envFuncs;
    return ${compiledSourceCode}`,
    ) as any;
    const validatorFunc = getValidatorFunc(envFuncs);

    const r: GenericValidator = { ...validatorHeader, validatorFunc };
    return r;
}
