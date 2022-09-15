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

  public async insert<T>(table: string, data: T[]): Promise<boolean> {
    const database = `${this.options.database}.` ?? "";
    const query = `INSERT INTO ${database}${table} FORMAT JSONEachRow`;
    const body = data.map(d => JSON.stringify(d)).join("\n");

    const resutl = await this.performStatement(body, undefined, new URLSearchParams({ query }));

    return resutl.status === 200;
  }

  public async ping(): Promise<boolean> {
    const response = await this.httpClient.request({
      method: YacHttpClientMethod.GET,
      path: "/ping",
    });
    return response.payload === "Ok.\n";
  }

  private performStatement(
    body: string,
    params: YacClientQueryParams = {},
    urlSearchParams: URLSearchParams = new URLSearchParams()
  ): Promise<YacHttpClientResponse> {
    const queryParams = new Map(Object.entries(params));

    if (this.options.database) {
      urlSearchParams.set("database", this.options.database);
    }

    return this.httpClient.request({
      method: YacHttpClientMethod.POST,
      body: body.trim(),
      queryParams,
      urlSearchParams,
    });
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
