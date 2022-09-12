import { InternalQueryParams } from "../YacClient/tools/tools.types";

export enum YacHttpClientMethod {
  GET = "GET",
  POST = "POST",
}

export type YacHttpClientRequestParams = {
  method?: YacHttpClientMethod;
  path?: string;
  query?: string;
  queryParams?: InternalQueryParams;
};

export type YacHttpClientResponse = {
  payload: string;
  status: number;
  headers: Record<string, string>;
};
