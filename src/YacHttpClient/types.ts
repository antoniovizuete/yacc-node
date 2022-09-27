import { InternalQueryParams } from "../YacClient/tools/tools.types";

export enum YacHttpClientMethod {
  GET = "GET",
  POST = "POST",
}

export type YacHttpClientRequestParams = {
  method?: YacHttpClientMethod;
  path?: string;
  body?: string;
  queryParams?: InternalQueryParams;
  urlSearchParams?: URLSearchParams;
};

export type YacHttpClientResponse<T> = {
  payload: T;
  status: number;
  headers: Record<string, string>;
};
