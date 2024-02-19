import type { RsmObjectSearch } from "./rsm_types/index.js";

export interface HasIntegrationOpts {}
export interface GlobalApi {
    hasIntegration: (systemIdOrNameA: RsmObjectSearch, systemIdOrNameB: RsmObjectSearch, opts?: HasIntegrationOpts) => Promise<boolean>;
}

export const globalApi: GlobalApi = {
    hasIntegration: async (systemIdOrNameA: RsmObjectSearch, systemIdOrNameB: RsmObjectSearch, opts?: HasIntegrationOpts) => {
        return true;
    },
};
