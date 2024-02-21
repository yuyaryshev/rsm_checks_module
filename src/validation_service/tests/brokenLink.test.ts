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
                    validatorSet: "before_vision_approval",
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
                if (response?.errors?.[0]?.additionalMessage?.includes("Error on server while handling request")) {
                    response.errors[0].additionalMessage = "Error on server while handling request";
                }
                expectDeepEqual(response, {
                    errors: [
                        {
                            errorCode: "VE9003",
                            additionalMessage: "Error on server while handling request",
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
