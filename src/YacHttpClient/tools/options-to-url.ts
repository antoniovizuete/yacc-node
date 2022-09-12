import { YacInvalidOptionsError } from "../../errors/YacInvalidOptionsError";
import { YacClientURLOptions } from "../../YacClient/types";

export function optionsToUrl(options: YacClientURLOptions): URL {
  const { protocol, host, port } = options;
  try {
    return new URL(`${protocol}://${host}:${port}/`);
  } catch (error) {
    throw new YacInvalidOptionsError();
  }
}
