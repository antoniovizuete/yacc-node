import { YacInvalidConnectionStringError } from "../../errors/YacInvalidConnectionStringError";
import { YacClientOptions } from "../types";

const CLICKHOUSE_TOKEN = "clickhouse:";

const isValidConnectionString = (connectionString: string) =>
  connectionString &&
  typeof connectionString === "string" &&
  connectionString.startsWith(CLICKHOUSE_TOKEN);

export function connectionStringToOptions(connectionString: string): YacClientOptions {
  if (!isValidConnectionString(connectionString)) {
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
      username: url.username || undefined,
      password: url.password || undefined,
      database: url.pathname.replace(/^\//, "") || undefined,
    };
    return options;
  } catch (error) {
    throw new YacInvalidConnectionStringError();
  }
}
