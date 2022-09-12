import { YacClientUserOptions } from "../../YacClient/types";

export const HEADER_FORMAT = "X-ClickHouse-Format";
export const HEADER_KEY = "X-ClickHouse-Key";
export const HEADER_USER = "X-ClickHouse-User";

export function buildHeaders({
  username,
  password,
}: Partial<YacClientUserOptions>): Record<string, string> {
  return {
    [HEADER_USER]: username ?? "default",
    [HEADER_KEY]: password ?? "",
    [HEADER_FORMAT]: "JSON",
  };
}
