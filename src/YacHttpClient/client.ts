import * as http from "node:http";
import * as https from "node:https";
import { YacQuerySyntaxError } from "../errors/YacQuerySyntaxError";

import { YacClientOptions } from "../YacClient/types";
import { HTTP_200, HTTP_300, HTTP_500 } from "./constants";
import { buildHeaders } from "./tools/build-headers";
import { buildUrl } from "./tools/build-url";
import { YacHttpClientMethod, YacHttpClientRequestParams, YacHttpClientResponse } from "./types";

export class YacHttpClient {
  private readonly options: YacClientOptions;
  constructor(options: YacClientOptions) {
    this.options = options;
  }

  public request<R = YacHttpClientResponse>(
    params: YacHttpClientRequestParams,
    handler = responseHandler
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const { method, path, body, queryParams, urlSearchParams } = params;

      const module = this.options.protocol === "https" ? https : http;

      const request = module.request(
        buildUrl({ ...this.options, path, queryParams, urlSearchParams }),
        {
          method: method ?? YacHttpClientMethod.POST,
          headers: buildHeaders(this.options),
        },
        handler(resolve, reject)
      );

      if (method === YacHttpClientMethod.POST && body) {
        request.write(body);
      }

      request.end();
    });
  }
}

function responseHandler(
  resolve: (value: any | PromiseLike<any>) => void,
  reject: (reason?: any) => void
): ((res: http.IncomingMessage) => void) | undefined {
  return response => {
    const array: Uint8Array[] = [];
    response.on("data", chunk => array.push(chunk));
    response.on("end", () => {
      const status = response.statusCode ?? HTTP_500;
      const result = {
        status,
        payload: Buffer.concat(array).toString(),
        headers: response.headers as Record<string, string>,
      };

      console.dir(result, { depth: null });
      if (status >= HTTP_200 && status < HTTP_300) {
        resolve(result);
      } else {
        console.error(result.payload);
        reject(new YacQuerySyntaxError(result.payload));
      }
    });
    response.on("error", error => {
      reject(error);
    });
  };
}
