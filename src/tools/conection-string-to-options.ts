import { YacInvalidConnectionStringError } from "../errors/YacInvalidConnectionStringError";
import { YacClientOptions } from "../types";

const CLICKHOUSE_TOKEN = "clickhouse:";

export function connectionStringToOptions(connectionString: string): YacClientOptions {
  const isValidConnectionString = () =>
    connectionString &&
    typeof connectionString === "string" &&
    connectionString.startsWith(CLICKHOUSE_TOKEN);

  if (!isValidConnectionString()) {
    throw new YacInvalidConnectionStringError();
  }
  const normailizedConnectionString = connectionString.replace(
    new RegExp(`^${CLICKHOUSE_TOKEN}`, "g"),
    "http://"
  );

  try {
    const url = new URL(normailizedConnectionString);

    const options: YacClientOptions = {
      protocol: url.searchParams.has("secure") ? "https" : "http",
      host: url.hostname,
      port: +url.port,
      username: url.username,
      password: url.password,
      database: url.pathname.replace(/^\//, ""),
    };
    return options;
  } catch (error) {
    throw new YacInvalidConnectionStringError();
  }
}
