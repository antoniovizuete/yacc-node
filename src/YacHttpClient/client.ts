import * as http from "http";
import * as https from "https";

import { YacClientOptions } from "../YacClient/types";
import { ResponseHandler } from "./response-handlers/types";
import { buildHeaders } from "./tools/build-headers";
import { buildUrl } from "./tools/build-url";
import { YacHttpClientMethod, YacHttpClientRequestParams, YacHttpClientResponse } from "./types";

export class YacHttpClient {
  private readonly options: YacClientOptions;
  constructor(options: YacClientOptions) {
    this.options = options;
  }

  public request<R>(
    params: YacHttpClientRequestParams,
    repsonseHandler: ResponseHandler<R>
  ): Promise<YacHttpClientResponse<R>> {
    return new Promise((resolve, reject) => {
      const { method, path, body, queryParams, urlSearchParams } = params;

      const module = this.options.protocol === "https" ? https : http;

      const request = module.request(
        buildUrl({ ...this.options, path, queryParams, urlSearchParams }),
        {
          method: method ?? YacHttpClientMethod.POST,
          headers: buildHeaders(this.options),
        },
        repsonseHandler(resolve, reject)
      );

      if (method === YacHttpClientMethod.POST && body) {
        request.write(body);
      }

      request.end();
    });
  }
}
