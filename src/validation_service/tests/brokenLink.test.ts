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

describe("rsm_checks_module/validation_service/tests/brokenLink.test.ts", () => {
    it("validateApi - broken link", async function () {
        const testServiceOpts = makeTestServiceOpts(1);
        const validationService = initValidationService(testServiceOpts);

        try {
            await validationService.start();
            const axiosOpts = {
                baseURL: makeCallerUrl(testServiceOpts),
            };
            const axiosInstance = axios.create(axiosOpts);

            const apiCaller = makeApiCaller(axiosInstance);

            {
                const request: typeof validateApi.request = {
                    objects: [
                        {
                            id: "sysid_NIB",
                            type: "System",
                            name: "НИБ.Эквайринг",
                            description: "НИБ.Эквайринг - это модуль НИБа, отвечающий за интернет эквайринг и торговый эквайринг",

                            changeState: "unchanged",
                            flags: [],
                            netSegment: "MIXED",

                            ports: [],
                            interfaces: [],
                            integrations: [],
                            integrationSides: [],
                        },
                        {
                            id: "sysid_NIB_Equair",
                            type: "System",
                            name: "НИБ.Эквайринг",
                            description: "НИБ.Эквайринг - это модуль НИБа, отвечающий за интернет эквайринг и торговый эквайринг",

                            parentSystem: { id: "sysid_NIB" },
                            changeState: "unchanged",
                            flags: [],
                            netSegment: "DMZ",

                            ports: [],
                            interfaces: [],
                            integrations: [],
                            integrationSides: [],
                        },
                        {
                            id: "sysid_SignModule",
                            type: "System",
                            name: "SignModule",
                            description: "Это модуль НИБа отвечающий за электронные подписи",

                            changeState: "unchanged",
                            flags: [],
                            netSegment: "LAN",

                            ports: [{ id: "sysid_SignModule_port1" }],
                            interfaces: [],
                            integrations: [],
                            integrationSides: [],
                        },
                        {
                            id: "sysid_SignModule_port1",
                            type: "Port",
                            name: "Port1",
                            description: "",
                            changeState: "unchanged",

                            system: { id: "sysid_SignModule" },
                            interfaces: [{ id: "sysid_SignModule_ifc1" }],
                        },
                        {
                            id: "sysid_SignModule_ifc1",
                            type: "Interface",
                            name: "Ifc1",
                            description: "",
                            changeState: "unchanged",

                            port: { id: "sysid_SignModule_port_BROKEN" },
                            integrationSides: [{ id: "integrid_1_side1" }],
                            requester: true,
                        },
                        {
                            id: "sysid_PartnerSystem",
                            type: "System",
                            name: "PartnerSystem",
                            description: "Это система партнера",

                            changeState: "unchanged",
                            flags: [],
                            netSegment: "WAN",

                            ports: [],
                            interfaces: [],
                            integrations: [],
                            integrationSides: [],
                        },
                        {
                            id: "sysid_PartnerSystem_port1",
                            type: "Port",
                            name: "Port1",
                            description: "",
                            changeState: "unchanged",

                            system: { id: "sysid_PartnerSystem" },
                            interfaces: [{ id: "sysid_PartnerSystem_ifc5" }],
                        },
                        {
                            id: "sysid_PartnerSystem_ifc5",
                            type: "Interface",
                            name: "Ifc5",
                            description: "",
                            changeState: "unchanged",

                            port: { id: "sysid_PartnerSystem_port1" },
                            integrationSides: [{ id: "integrid_1_side1" }],
                            requester: true,
                        },
                        {
                            type: "Integration",
                            id: "integrid_1",
                            name: "Кривая интеграция",

                            changeState: "unchanged",
                            source: { id: "integrid_1_side1" },
                            target: { id: "integrid_1_side2" },
                        } as Integration,
                        {
                            id: "integrid_1_side1",
                            type: "IntegrationSide",
                            system: { id: "sysid_SignModule" },
                            integration: { id: "integrid_1" },
                            ifc: { id: "sysid_SignModule_ifc1" },
                        },
                        {
                            id: "integrid_1_side2",
                            type: "IntegrationSide",
                            system: { id: "sysid_PartnerSystem" },
                            // port: Port;
                            // term: Term;
                            // ifc: Interface;
                            ifc: { id: "sysid_PartnerSystem_ifc5" },
                            integration: { id: "integrid_1" },
                        },
                    ],
                };

                const response = await apiCaller.validate(request);
                expectDeepEqual(response, {
                    errors: [
                        {
                            errorCode: "VE9003",
                            additionalMessage:
                                "CODE00000000 Error on server while handling request. Error stack: Error: CODE00000001 ReconstructObject failed for path=[\"port\"] id='sysid_SignModule_port_BROKEN' - not found!\n    at ReconstructObjectContext.reconstructObjectInIndex (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\src\\api\\reconstructObjectsArray.ts:13:23)\n    at ReconstructObjectContext.reconstructObject (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\src\\api\\reconstructObjectsArray.ts:34:35)\n    at reconstructObjectsArray (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\src\\api\\reconstructObjectsArray.ts:58:11)\n    at requestHandler (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\src\\validation_service\\api_implementation\\validate.ts:80:66)\n    at fullHandlerFunc (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\yhttp_api_express@1.0.9\\node_modules\\yhttp_api_express\\src\\implementHttpExpressApi.ts:23:34)\n    at Layer.handle [as handle_request] (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\express@4.18.2\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\express@4.18.2\\node_modules\\express\\lib\\router\\route.js:144:13)\n    at Route.dispatch (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\express@4.18.2\\node_modules\\express\\lib\\router\\route.js:114:3)\n    at Layer.handle [as handle_request] (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\express@4.18.2\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\express@4.18.2\\node_modules\\express\\lib\\router\\index.js:284:15\n    at Function.process_params (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\express@4.18.2\\node_modules\\express\\lib\\router\\index.js:346:12)\n    at next (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\express@4.18.2\\node_modules\\express\\lib\\router\\index.js:280:10)\n    at D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\body-parser@1.20.1\\node_modules\\body-parser\\lib\\read.js:137:5\n    at AsyncResource.runInAsyncScope (node:async_hooks:206:9)\n    at invokeCallback (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\raw-body@2.5.1\\node_modules\\raw-body\\index.js:231:16)\n    at done (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\raw-body@2.5.1\\node_modules\\raw-body\\index.js:220:7)\n    at IncomingMessage.onEnd (D:\\b\\Mine\\GIT_Work\\rsm_checks_module\\node_modules\\.pnpm\\raw-body@2.5.1\\node_modules\\raw-body\\index.js:280:7)\n    at IncomingMessage.emit (node:events:511:28)\n    at endReadableNT (node:internal/streams/readable:1367:12)\n    at processTicksAndRejections (node:internal/process/task_queues:82:21)",
                        },
                    ],
                });
            }
            //        } catch (e: any) {
            //            throw e;
        } finally {
            validationService?.stop();
        }
    });
});
