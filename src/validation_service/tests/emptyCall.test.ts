import { expectDeepEqual } from "ystd";
import { initValidationService, ValidationServiceOpts } from "../validation_service.js";
import axios from "axios";
import { makeApiCaller, makeCallerUrl, validateApi } from "../../api/index.js";
import {
    decoderIntegrationPoor,
    decoderSystemPoor,
    Integration,
    IntegrationSide,
    Interface,
    Port,
    RsmChangeState,
    System,
    SystemFlag,
    SystemNetSegment,
    Term,
} from "../../rsm_types/index.js";

const port = 8340;
const makeTestServiceOpts: (portOffset: number) => ValidationServiceOpts = (portOffset: number) => {
    const actualPort = port + portOffset;
    return {
        port: actualPort,
        virtualFolder: "/otherApi/",
        baseUrl: `http://localhost:${actualPort}/otherApi/`,
    };
};

describe("rsm_checks_module/validation_service/tests/emptyCall.test.ts", () => {
    it("validateApi - empty request", async function () {
        const testServiceOpts = makeTestServiceOpts(0);
        const validationService = initValidationService(testServiceOpts);

        try {
            await validationService.start();
            const axiosOpts = {
                baseURL: makeCallerUrl(testServiceOpts),
            };
            const axiosInstance = axios.create(axiosOpts);

            const apiCaller = makeApiCaller(axiosInstance);

            {
                // Test with empty request first
                const request: typeof validateApi.request = { objects: [] };
                const response = await apiCaller.validate(request);
                expectDeepEqual(response, { errors: [] });
            }

            // } catch (e: any) {
            //     throw e;
        } finally {
            validationService?.stop();
        }
    });
});
