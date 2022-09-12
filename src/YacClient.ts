import { YacInvalidQueryFormat } from "./errors/YacInvalidQueryFormat";
import { connectionStringToOptions } from "./tools/conection-string-to-options";
import { YacHttpClient, YacRequesterMethod } from "./tools/YacHttpClient";
import { YacClientOptions, YacClientQueryParams } from "./types";

export class YacClient {
  private readonly options: YacClientOptions;
  private readonly httpClient: YacHttpClient;

  constructor(connectionString: string);
  constructor(options: YacClientOptions);
  constructor(arg: string | YacClientOptions) {
    this.options = this.buildOptions(arg);
    this.httpClient = new YacHttpClient(this.options);
  }

  public async query<T>(query: string, params?: YacClientQueryParams): Promise<T[]> {
    const queryParams = params instanceof Map ? params : new Map(Object.entries(params ?? {}));

    if (this.options.database) {
      queryParams.set("database", this.options.database);
    }

    if (!this.validateQuery(query)) {
      throw new YacInvalidQueryFormat();
    }

    const payload = query.trim();

    const response = await this.httpClient.request({
      method: YacRequesterMethod.POST,
      payload,
      queryParams,
    });

    return JSON.parse(response.payload).data;
  }

  public async ping(): Promise<boolean> {
    const response = await this.httpClient.request({ path: "/ping" });
    return response.payload === "Ok.\n";
  }

  private buildOptions(arg: string | YacClientOptions): YacClientOptions {
    if (typeof arg === "string") {
      return connectionStringToOptions(arg);
    }
    return arg;
  }

  private validateQuery(query: string): boolean {
    const regex = /FORMAT\s+([a-zA-Z]+)/g;
    const [, format] = regex.exec(query) ?? [];
    return query != null && query.trim().length > 0 && (format === undefined || format === "JSON");
  }
}
