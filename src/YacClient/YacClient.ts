import { YacInvalidQueryFormat } from "../errors/YacInvalidQueryFormat";

import { YacHttpClient, YacHttpClientMethod } from "../YacHttpClient";
import { buildOptions } from "./tools/build-options";
import { YacClientOptions, YacClientQueryParams } from "./types";

export class YacClient {
  private readonly options: YacClientOptions;
  private readonly httpClient: YacHttpClient;

  constructor(connectionString: string);
  constructor(options: YacClientOptions);
  constructor(arg: string | YacClientOptions) {
    this.options = buildOptions(arg);
    this.httpClient = new YacHttpClient(this.options);
  }

  public async query<T>(query: string, params?: YacClientQueryParams): Promise<T[]> {
    const queryParams = new Map(Object.entries(params ?? {}));

    if (this.options.database) {
      queryParams.set("database", this.options.database);
    }

    if (!this.validateQuery(query)) {
      throw new YacInvalidQueryFormat();
    }

    const payload = query.trim();

    const response = await this.httpClient.request({
      method: YacHttpClientMethod.POST,
      query: payload,
      queryParams,
    });

    return JSON.parse(response.payload).data;
  }

  public async ping(): Promise<boolean> {
    const response = await this.httpClient.request({ path: "/ping" });
    return response.payload === "Ok.\n";
  }

  private validateQuery(query: string): boolean {
    const regex = /FORMAT\s+([a-zA-Z]+)/g;
    const [, format] = regex.exec(query) ?? [];
    return query != null && query.trim().length > 0 && (format === undefined || format === "JSON");
  }
}
