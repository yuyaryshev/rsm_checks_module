import { AxiosInstance } from "axios";
import { httpApiFunction } from "yhttp_api";
import { ValidationServiceOpts } from "../validation_service/validation_service.js";
import { validateApi } from "./validateApi.js";
import { updateValidatorsApi } from "./updateValidatorsApi.js";

// @INPRINT_START {exclude:["projmeta"]}
export * from "./reconstructObjectsArray.js";
export * from "./updateValidatorsApi.js";
export * from "./validateApi.js";
// @INPRINT_END

export const defaultCallerUrlOpts = {
  protocol: "http",
  virtualFolder: "/api/",
};

export interface CallerUrlOpts {
  protocol?: string;
  host?: string;
  port?: number;
  virtualFolder?: string;
  baseUrl?: string;
}

export function makeCallerUrl(opts0: CallerUrlOpts) {
  const opts = { ...defaultCallerUrlOpts, ...opts0 };
  return (
    opts.baseUrl ||
    `${opts.protocol}://${opts.host}:${opts.port}${opts.virtualFolder}`
  );
}

export function makeApiCaller(axiosInstance: AxiosInstance) {
  const r = {
    validate: httpApiFunction(axiosInstance, validateApi),
    updateValidators: httpApiFunction(axiosInstance, updateValidatorsApi),
  };
  return r;
}

export type ApiCaller = ReturnType<typeof makeApiCaller>;
