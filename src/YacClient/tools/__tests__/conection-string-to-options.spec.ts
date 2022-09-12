import { YacInvalidConnectionStringError } from "../../../errors/YacInvalidConnectionStringError";
import { connectionStringToOptions } from "../../tools/conection-string-to-options";

describe("connectionStringToOptions", () => {
  it("should throw an error if connection string is not valid", () => {
    expect(() => connectionStringToOptions("")).toThrowError(new YacInvalidConnectionStringError());
  });

  it("should throw an error if the connection string is not value (proper protocol, bad url)", () => {
    expect(() => connectionStringToOptions("clickhouse://:::::::::8123/")).toThrowError(
      new YacInvalidConnectionStringError()
    );
  });

  it("should return options if connection string is valid", () => {
    expect(connectionStringToOptions("clickhouse://user:password@localhost:8123/database")).toEqual(
      {
        protocol: "http",
        host: "localhost",
        port: 8123,
        username: "user",
        password: "password",
        database: "database",
      }
    );
  });

  it("should return options if connection string is valid (secure)", () => {
    expect(
      connectionStringToOptions("clickhouse://user:password@localhost:8123/database?secure")
    ).toEqual({
      protocol: "https",
      host: "localhost",
      port: 8123,
      username: "user",
      password: "password",
      database: "database",
    });
  });
});
