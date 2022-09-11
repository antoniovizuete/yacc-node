import { YacClientURLOptions } from "../types";
import { optionsToUrl } from "./options-to-url";
import { InternalQueryParams } from "./tools.types";

type Params = YacClientURLOptions & {
  path?: string;
  queryParams?: InternalQueryParams;
};

const setURLSearchParams = (url: URL, queryParamsMap?: InternalQueryParams): void => {
  if (!queryParamsMap) {
    return;
  }
  const queryParams = Object.fromEntries(
    [...queryParamsMap.entries()].flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(item => [key, item.toString()]);
      }
      return [[key, value.toString()]];
    })
  );

  [...new URLSearchParams(queryParams).entries()].forEach(([key, value]) =>
    url.searchParams.set(`param_${key}`, value)
  );
};

const setPath = (url: URL, path?: string): void => {
  url.pathname = path ?? "/";
};

export function buildUrl(params: Params): URL {
  const { path, queryParams, ...urlOptions } = params;
  const url = optionsToUrl(urlOptions);

  setPath(url, path);
  setURLSearchParams(url, queryParams);

  return url;
}
