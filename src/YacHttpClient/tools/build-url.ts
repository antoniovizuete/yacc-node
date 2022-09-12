import { InternalQueryParams } from "../../YacClient/tools/tools.types";
import { YacClientURLOptions, YacQueryParamsAllowedTypes } from "../../YacClient/types";
import { optionsToUrl } from "./options-to-url";

type Params = YacClientURLOptions & {
  path?: string;
  queryParams?: InternalQueryParams;
};

const setURLSearchParams = (url: URL, queryParamsMap?: InternalQueryParams): void => {
  if (!queryParamsMap) {
    return;
  }
  const getValue = (value: YacQueryParamsAllowedTypes) => {
    if (Array.isArray(value)) {
      return [
        "[",
        value.map(item => (typeof item === "string" ? `'${item}'` : item)).join(","),
        "]",
      ].join("");
    }
    return value.toString();
  };
  const queryParams = Object.fromEntries(
    [...queryParamsMap.entries()].map(([key, value]) => [key, getValue(value)])
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
