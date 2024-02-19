import { Integration, IntegrationSide } from "./Integration.js";
import { pushNewValues } from "../pushNewValues.js";
import { System } from "./System.js";
import { Port } from "./Port.js";
import { Interface } from "./Interface.js";
import { Term } from "./Term.js";
import { a } from "vite/dist/node/types.d-jgA8ss1A";
import { normalizeDataLinks } from "./normalizeDataLinks.js";

const IsDeepEnriched = Symbol("IsDeepEnriched");

const symmetricLinks = [
    ["System", "ports", "Port", "system"],
    ["System", "interfaces", "Interface", "system"],
    ["System", "integrations", undefined, undefined],
    ["System", "integrationSides", "IntegrationSide", "system"],
];

const linkPropagationPaths = [
    {
        path: {
            IntegrationSide: "integrationSides",
            Interface: "interfaces",
            Port: "ports",
            System: undefined,
        },
        fields: ["integrationSides", "interfaces", "ports"],
    },
];

function skipIfDeepEnriched(obj: any) {
    if (obj[IsDeepEnriched]) {
        return true;
    }
    obj[IsDeepEnriched] = true;
}

function enrichIntegrationSide(integrationSide: IntegrationSide, parent: Interface) {
    integrationSide.ifc = parent;

    integrationSide.port = integrationSide.ifc.port;
    integrationSide.system = integrationSide.port.system;
    integrationSide.term = integrationSide.port.term;
    return integrationSide;
}

function enrichIntegration(integration: Integration) {
    pushNewValues(integration, "sides", integration.source, integration.target);
    integration.source.otherSide = integration.target;
    integration.target.otherSide = integration.source;
}

function enrichInterface(ifc: Interface, parent: Port) {
    ifc.port = parent;

    ifc.system = ifc.port.system;
    ifc.term = ifc.port.term;
    for (const integrationSide of ifc.integrationSides) {
        pushNewValues(ifc, "integrations", integrationSide.integration);
    }
}

function enrichPort(port: Port, parent: System) {
    // port.system = parent;

    for (const ifc of port.interfaces) {
        pushNewValues(port, "integrations", ...ifc.integrations);
        pushNewValues(port, "integrationSides", ...ifc.integrationSides);
    }
}

function enrichTerm(term: Term) {}

function enrichSystem(sys: System) {
    for (const port of sys.ports) {
        for (const ifc of port.interfaces) {
            pushNewValues(sys, "interfaces", ...port.interfaces);
            pushNewValues(sys, "integrations", ...port.integrations);
            pushNewValues(sys, "integrationSides", ...port.integrationSides);
        }
    }
}

function enrichSystemDeep(sys: System) {
    if (skipIfDeepEnriched(sys)) {
        return;
    }

    for (const port of sys.ports) {
        for (const ifc of port.interfaces) {
            for (const intSide of ifc.integrationSides) {
                enrichIntegration(intSide.integration);
            }
            enrichInterface(ifc, port);
        }
        enrichTerm(port.term);
        enrichPort(port, sys);
    }
    enrichSystem(sys);
}

function enrichIntegrationDeep(integration: Integration) {
    if (skipIfDeepEnriched(integration)) {
        return;
    }

    enrichIntegrationSideDeep(integration.source);
    enrichIntegrationSideDeep(integration.target);
}

function enrichIntegrationSideDeep(intSide: IntegrationSide) {
    if (skipIfDeepEnriched(intSide)) {
        return;
    }

    pushNewValues(intSide.ifc, "integrationSides", intSide);
    enrichIntegration(intSide.integration);
}

export function enrichData(objects: any[]) {
    normalizeDataLinks(objects);
    for (const obj of objects) {
        switch (obj.type) {
            case "System":
                enrichSystemDeep(obj);
                break;
            case "Integration":
                enrichIntegrationDeep(obj);
                break;
            case "IntegrationSide":
                enrichIntegrationSideDeep(obj);
                break;
        }
    }
}
