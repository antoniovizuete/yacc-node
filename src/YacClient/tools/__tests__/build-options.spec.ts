import { YacClientOptions } from "../../types";
import { buildOptions } from "../build-options";

describe("buildOptions", () => {
  it("should return options if connection string is passed", () => {
    const options = buildOptions("clickhouse://localhost:8123");
    expect(options).toEqual({
      database: undefined,
      host: "localhost",
      password: undefined,
      port: 8123,
      protocol: "http",
      username: undefined,
    });
  });

  it("should return the same options that are passed", () => {
    const options: YacClientOptions = {
      database: "default",
      host: "localhost",
      password: "123",
      port: 8123,
      protocol: "http",
      username: "username",
    };
    expect(buildOptions(options)).toEqual(options);
  });
});
