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
    isChildSystemOf,
    Port,
    RsmChangeState,
    System,
    SystemFlag,
    SystemNetSegment,
    Term,
} from "../../rsm_types/index.js";
import { array, boolean, number, optional, string } from "../../../../json-type-validation";
import { decoderSerializedValidator, ValidationError, ValidatorType } from "../../validator_types/index.js";
import { isOneOf, rsmSystemId } from "../../helperFuncs.js";

const port = 8340;
const makeTestServiceOpts: (portOffset: number) => ValidationServiceOpts = (portOffset: number) => {
    const actualPort = port + portOffset;
    return {
        port: actualPort,
        virtualFolder: "/otherApi/",
        baseUrl: `http://localhost:${actualPort}/otherApi/`,
    };
};

describe("rsm_checks_module/validation_service/tests/updateValidator.test.ts", () => {
    it("updateValidator & request1", async function () {
        const testServiceOpts = makeTestServiceOpts(1);
        const validationService = initValidationService(testServiceOpts);

        try {
            await validationService.start();
            const axiosOpts = {
                baseURL: makeCallerUrl(testServiceOpts),
            };
            const axiosInstance = axios.create(axiosOpts);

            const apiCaller = makeApiCaller(axiosInstance);

            const validator = {
                validatorId: "add48106-b1c1-4d6f-b02b-e28e251fc2f2",
                validatorType: "Integration" as const,
                name: "Чисто пассивные системы",
                description:
                    "Чисто пассивные системы не могут никого вызывать, - могут только принимать вызовы. Примеры: базы данных, очереди, ElasticSearch",
                validatorSourceCode: `(integration: Integration, errors: ValidationError[]) => {
        for (const integrationSide of integration.sides) {
            if (integrationSide.system.netSegment !== "WAN") {
                continue;
            }

            if (!isOneOf(integrationSide.otherSide.system.netSegment, "WAN", "DMZ")) {
                errors.push({
                    errorCode: "VE0006",
                    object: integration,
                    additionalMessage: "VALIDATOR WAS UPDATED!"
                });
            }
        }
    }`,
            };
            await apiCaller.updateValidators({ validators: [validator] });

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

                            port: { id: "sysid_SignModule_port1" },
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
                            errorCode: "VE0005",
                            objectId: "integrid_1",
                        },
                        {
                            errorCode: "VE0006",
                            objectId: "integrid_1",
                            additionalMessage: "VALIDATOR WAS UPDATED!",
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
