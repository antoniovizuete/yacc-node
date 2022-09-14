import { YacInvalidQueryFormat } from "../errors/YacInvalidQueryFormat";
import { YacHttpClient, YacHttpClientMethod } from "../YacHttpClient";
import { YacHttpClientResponse } from "../YacHttpClient/types";
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

  public async execute(query: string, params?: YacClientQueryParams): Promise<boolean> {
    const response = await this.performStatement(query, params);

    return response.status === 200;
  }

  public async query<T>(query: string, params?: YacClientQueryParams): Promise<T[]> {
    this.validateQuery(query);
    const response = await this.performStatement(query, params);

    return JSON.parse(response.payload).data;
  }

  private performStatement(
    query: string,
    params: YacClientQueryParams = {}
  ): Promise<YacHttpClientResponse> {
    const queryParams = new Map(Object.entries(params));

    if (this.options.database) {
      queryParams.set("database", this.options.database);
    }

    return this.httpClient.request({
      method: YacHttpClientMethod.POST,
      query: query.trim(),
      queryParams,
    });
  }

  public async ping(): Promise<boolean> {
    const response = await this.httpClient.request({ path: "/ping" });
    return response.payload === "Ok.\n";
  }

  private validateQuery(query: string): void {
    const [, format] = /FORMAT\s+([a-zA-Z]+)/g.exec(query) ?? [];
    const isValid = () =>
      query != null && query.trim().length > 0 && (format === undefined || format === "JSON");

    if (!isValid()) {
      throw new YacInvalidQueryFormat();
    }
  }
}
