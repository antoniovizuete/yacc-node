import { InternalQueryParams } from "../../YacClient/tools/tools.types";
import { YacClientURLOptions, YacQueryParamsAllowedTypes } from "../../YacClient/types";
import { optionsToUrl } from "./options-to-url";

type Params = YacClientURLOptions & {
  path?: string;
  queryParams?: InternalQueryParams;
  urlSearchParams?: URLSearchParams;
};

const setQueryParamsAsURLSearchParams = (url: URL, queryParamsMap?: InternalQueryParams): void => {
  if (!queryParamsMap) {
    return;
  }
  const getValue = (value: YacQueryParamsAllowedTypes) => {
    if (Array.isArray(value)) {
      return [
        "[",
        value.map((item) => (typeof item === "string" ? `'${item}'` : item)).join(","),
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

const addUrlSearchParams = (url: URL, searchParams?: URLSearchParams): void => {
  if (!searchParams) {
    return;
  }
  searchParams.forEach((value, key) => url.searchParams.set(key, value));
};

export function buildUrl(params: Params): URL {
  const { path, queryParams, urlSearchParams, ...urlOptions } = params;
  const url = optionsToUrl(urlOptions);

  if (path) {
    url.pathname = path;
  }

  setQueryParamsAsURLSearchParams(url, queryParams);
  addUrlSearchParams(url, urlSearchParams);

  return url;
}
