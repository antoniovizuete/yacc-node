import { buildUrl } from "../tools/build-url";
import { YacClientURLOptions } from "../types";

describe("buildUrl", () => {
  const options: YacClientURLOptions = {
    protocol: "http",
    host: "localhost",
    port: 8123,
  };
  const path = "/path";
  const queryParams = new Map([["key", "value"]]);

  it("should return url with path and query params", () => {
    expect(buildUrl({ path, queryParams, ...options }).toString()).toEqual(
      "http://localhost:8123/path?param_key=value"
    );
  });

  it("should return url with path", () => {
    expect(buildUrl({ path, ...options }).toString()).toEqual("http://localhost:8123/path");
  });

  it("should return url with query params", () => {
    expect(buildUrl({ queryParams, ...options }).toString()).toEqual(
      "http://localhost:8123/?param_key=value"
    );
  });

  it("should return url", () => {
    expect(buildUrl(options).toString()).toEqual("http://localhost:8123/");
  });
});
