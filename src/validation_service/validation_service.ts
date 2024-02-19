import express from "express";
import { ApiRoot } from "yhttp_api_express";
import { serverStartupAutotests } from "./serverStartupAutotests.js";
import { CallerUrlOpts } from "../api/index.js";
import { a } from "vite/dist/node/types.d-jgA8ss1A";
import { ServiceApiEnv } from "./ServiceApiEnv.js";
import { publishValidatorApis } from "./api_implementation/index.js";

export const defaultValidationServiceOpts = {
    virtualFolder: "/api/",
};

export interface ValidationServiceOpts0 extends CallerUrlOpts {
    port: number;
    baseUrl: string;
    virtualFolder?: string;
}

export interface ValidationServiceOpts extends CallerUrlOpts {
    port: number;
    baseUrl: string;
    virtualFolder: string;
}

export interface ValidationService {
    start: () => Promise<void> | void;
    stop: () => Promise<void> | void;
}

export function initValidationService(opts0: ValidationServiceOpts0) {
    const opts: ValidationServiceOpts = { ...defaultValidationServiceOpts, ...opts0 };

    const httpServerApp = express();
    httpServerApp.use(express.json());

    const apiRoot: ApiRoot = {
        httpServerApp,
        virtualFolder: opts.virtualFolder,
    };

    const apiPrereq: ServiceApiEnv = { apiRoot };
    publishValidatorApis(apiPrereq);

    let runningInstance: any;

    async function start() {
        runningInstance = httpServerApp.listen(opts.port, () => {
            console.log("CODE00001215", `Test server is listening on port ${opts.port}`);
        }) as any;
        await serverStartupAutotests(opts);
    }

    function stop() {
        if (runningInstance) {
            runningInstance.close(() => {
                console.log("CODE00001216", `Test server on port ${opts.port} is now offline.`);
            });
        }
    }

    return { start, stop };
}
