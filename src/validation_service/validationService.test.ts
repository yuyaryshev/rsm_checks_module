import { expectDeepEqual } from "ystd";
import { initValidationService, ValidationServiceOpts } from "./validation_service.js";
import axios from "axios";
import { makeApiCaller, makeCallerUrl, validateApi } from "../api/index.js";
import { a } from "vite/dist/node/types.d-jgA8ss1A";
import { Integration, IntegrationSide, Interface, Port, RsmChangeState, System, SystemFlag, SystemNetSegment, Term } from "../rsm_types/index.js";

const port = 8340;
const makeTestServiceOpts: (portOffset: number) => ValidationServiceOpts = (portOffset: number) => {
    const actualPort = port + portOffset;
    return {
        port: actualPort,
        virtualFolder: "/otherApi/",
        baseUrl: `http://localhost:${actualPort}/otherApi/`,
    };
};

describe("rsm_checks_module/validation_service/validationService.test.ts", () => {
    it.only("validateApi - request1", async function () {
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

                            ports: [],
                            interfaces: [],
                            integrations: [],
                            integrationSides: [],
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
                            type: "Integration",
                            id: "integrid_1",
                            name: "Кривая интеграция",

                            changeState: "unchanged",

                            source: {
                                type: "IntegrationSide",
                                system: { id: "sysid_SignModule" },
                                // port: Port;
                                // term: Term;
                                // ifc: Interface;
                                integration: { id: "integrid_1" },
                            },
                            target: {
                                type: "IntegrationSide",
                                system: { id: "sysid_PartnerSystem" },
                                // port: Port;
                                // term: Term;
                                // ifc: Interface;
                                integration: { id: "integrid_1" },
                            },
                        } as Integration,
                    ],
                };
                const response = await apiCaller.validate(request);
                expectDeepEqual(response, { errors: ["tbd"] } as any);
            }
            //        } catch (e: any) {
            //            throw e;
        } finally {
            validationService?.stop();
        }
    });

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
