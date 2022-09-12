import { buildHeaders } from "../tools/build-headers";

describe("buildHeaders", () => {
  it("should return the headers", () => {
    expect(buildHeaders({ username: "foo", password: "bar" })).toEqual({
      "X-ClickHouse-Format": "JSON",
      "X-ClickHouse-Key": "bar",
      "X-ClickHouse-User": "foo",
    });
  });
});
