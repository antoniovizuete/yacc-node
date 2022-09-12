import * as http from "node:http";
import * as https from "node:https";
import { YacClientOptions } from "../types";
import { buildUrl } from "./build-url";
import { InternalQueryParams } from "./tools.types";

export enum YacRequesterMethod {
  GET = "GET",
  POST = "POST",
}

type YacRequestParams = {
  method?: YacRequesterMethod;
  path?: string;
  payload?: any;
  queryParams?: InternalQueryParams;
};

type YacResponse = {
  payload: string;
  status: number;
  headers: Record<string, string>;
};

export class YacHttpClient {
  private readonly options: YacClientOptions;
  constructor(options: YacClientOptions) {
    this.options = options;
  }

  public request(params: YacRequestParams): Promise<YacResponse> {
    return new Promise((resolve, reject) => {
      const { method, path, payload, queryParams } = params;

      const url = buildUrl({ ...this.options, path, queryParams });
      const headers = {
        "X-ClickHouse-User": this.options.username ?? "default",
        "X-ClickHouse-Key": this.options.password ?? "",
        "X-ClickHouse-Format": "JSON",
      };

      const httpOptions: http.RequestOptions = {
        method: method ?? YacRequesterMethod.GET,
        headers,
      };

      const isHttps = () => this.options.protocol === "https";

      const request = (isHttps() ? https : http).request(url, httpOptions, response => {
        const array: Uint8Array[] = [];
        response.on("data", chunk => array.push(chunk));
        response.on("end", () => {
          const statusCode = response.statusCode ?? 500;
          const result: YacResponse = {
            payload: Buffer.concat(array).toString(),
            status: response.statusCode ?? 500,
            headers: response.headers as Record<string, string>,
          };
          statusCode >= 200 && statusCode <= 299 ? resolve(result) : reject(result);
        });
        response.on("error", error => reject(error));
      });

      if (method === YacRequesterMethod.POST && payload) {
        if (typeof payload === "string") {
          request.write(payload);
        } else {
          request.write(JSON.stringify(payload));
        }
      }

      request.end();
    });
  }
}
