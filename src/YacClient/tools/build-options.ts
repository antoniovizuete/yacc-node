import { YacClientOptions } from "../types";
import { connectionStringToOptions } from "./conection-string-to-options";

export function buildOptions(arg: string | YacClientOptions): YacClientOptions {
  if (typeof arg === "string") {
    return connectionStringToOptions(arg);
  }
  return arg;
}
