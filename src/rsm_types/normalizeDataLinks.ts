import { Integration, Integration_normalizeLinks, IntegrationSide, IntegrationSide_normalizeLinks } from "./Integration.js";
import { pushNewValues } from "../pushNewValues.js";
import { System, System_normalizeLinks } from "./System.js";
import { Port, Port_normalizeLinks } from "./Port.js";
import { Interface, Interface_normalizeLinks } from "./Interface.js";
import { Term, Term_normalizeLinks } from "./Term.js";
import { a } from "vite/dist/node/types.d-jgA8ss1A";
import { RsmObject } from "./RsmObject.js";

const IsDeepEnriched = Symbol("IsDeepEnriched");

export function normalizeDataLinks(objects: any[]) {
    for (const object of objects) {
        switch (object.type) {
            case "System":
                System_normalizeLinks(object);
                break;
            case "Port":
                Port_normalizeLinks(object);
                break;
            case "Interface":
                Interface_normalizeLinks(object);
                break;
            case "Integration":
                Integration_normalizeLinks(object);
                break;
            case "IntegrationSide":
                IntegrationSide_normalizeLinks(object);
                break;
            case "Term":
                Term_normalizeLinks(object);
                break;
            default:
                throw new Error(`CODE00000000 rsm_checks_module.normalizeDataLinks doesn't support object.type='${object.type}'`);
        }
    }
}
