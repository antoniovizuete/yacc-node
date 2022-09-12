import { YacInvalidOptionsError } from "../../errors/YacInvalidOptionsError";
import { YacClientOptions } from "../../YacClient/types";
import { optionsToUrl } from "../tools/options-to-url";

describe("optionsToUrl", () => {
  it("should throw error if protocol or host or password are not vaild", () => {
    expect(() => optionsToUrl({} as YacClientOptions)).toThrowError(new YacInvalidOptionsError());
  });

  it("should return url if options is valid", () => {
    expect(
      optionsToUrl({
        protocol: "http",
        host: "host",
        port: 8123,
      }).toString()
    ).toEqual("http://host:8123/");
  });
});
