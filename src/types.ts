export type YacClientURLOptions = {
  protocol: "http" | "https";
  host: string;
  port: number;
};

export type YacClientUserOptions = {
  username: string;
  password: string;
  database: string;
};

export type YacClientOptions = YacClientURLOptions & YacClientUserOptions;

export type YacClientQueryParams = Record<string, YacQueryParamsAllowedTypes>;

export type YacQueryParamsAllowedTypes = string | readonly string[] | number | readonly number[];
