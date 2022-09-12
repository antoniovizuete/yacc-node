import { YacInvalidOptionsError } from "../../errors/YacInvalidOptionsError";
import { optionsToUrl } from "../../tools/options-to-url";
import { YacClientOptions } from "../../types";

describe("optionsToUrl", () => {
  it("should throw error if protocol or host or password are not vaild", () => {
    expect(() => optionsToUrl({} as YacClientOptions)).toThrowError(new YacInvalidOptionsError());
  });

  it("should return url if options is valid", () => {
    expect(
      optionsToUrl({
        protocol: "http",
        host: "localhost",
        port: 8123,
      }).toString()
    ).toEqual("http://localhost:8123/");
  });
});
