import { connectionStringToOptions } from "./tools/conection-string-to-options";
import { YacHttpClient, YacRequesterMethod } from "./tools/YacHttpClient";
import { YacClientOptions, YacClientQueryParams, YacQueryParamsAllowedTypes } from "./types";

export class YacClient {
  private readonly options: YacClientOptions;
  private readonly httpClient: YacHttpClient;

  constructor(connectionString: string);
  constructor(options: YacClientOptions);
  constructor(arg: string | YacClientOptions) {
    this.options = this.buildOptions(arg);
    this.httpClient = new YacHttpClient(this.options);
  }

  private buildOptions(arg: string | YacClientOptions): YacClientOptions {
    if (typeof arg === "string") {
      return connectionStringToOptions(arg);
    }
    return arg;
  }

  public async query<T>(query: string, params?: YacClientQueryParams): Promise<T[]> {
    const queryParams = params instanceof Map ? params : new Map(Object.entries(params ?? {}));

    if (this.options.database) {
      queryParams.set("database", this.options.database);
    }

    const response = await this.httpClient.request({
      method: YacRequesterMethod.POST,
      payload: query,
      queryParams,
    });

    return JSON.parse(response.payload).data;
  }

  public async ping(): Promise<boolean> {
    const response = await this.httpClient.request({ path: "/ping" });
    return response.payload === "Ok.\n";
  }
}
