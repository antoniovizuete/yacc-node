import { YacInvalidConnectionStringError } from "../errors/YacInvalidConnectionStringError";
import { YacClient } from "../YacClient";

describe("YacClient", () => {
  const client = new YacClient("clickhouse://localhost:8123/default");

  it("should return true if the clickhouse server is running", async () => {
    expect(await client.ping()).toBeTruthy();
  });

  it("should return 2 rows", async () => {
    const result = await client.query<{ a: number }>(
      "SELECT * FROM generateRandom('a UInt8') LIMIT 2"
    );
    expect(result).toHaveLength(2);
    expect(typeof result[0].a).toBe("number");
  });

  it("should return the same number passed as paramater", async () => {
    const result = await client.query<{ a: number }>("SELECT {myParam:UInt8} AS a", { myParam: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].a).toBe(1);
  });
});
