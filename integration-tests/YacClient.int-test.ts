import { YacInvalidQueryFormat } from "../src/errors/YacInvalidQueryFormat";
import { YacQuerySyntaxError } from "../src/errors/YacQuerySyntaxError";
import { YacClient } from "../src/YacClient/YacClient";

describe("YacClient", () => {
  const client = new YacClient("clickhouse://localhost:8123/default");

  it("should return true if the clickhouse server is running", async () => {
    expect(await client.ping()).toBeTruthy();
  });

  it("should return 2 rows", async () => {
    const length = 2;
    const result = await client.query<{ a: number }>(
      `SELECT * FROM generateRandom('a UInt8') LIMIT ${length}`
    );
    expect(result).toHaveLength(length);
    expect(typeof result[0].a).toBe("number");
  });

  it("should return the same number passed as paramater", async () => {
    const result = await client.query<{ a: number }>("SELECT {myParam:UInt8} AS a", { myParam: 1 });
    expect(result).toHaveLength(1);
    expect(result[0].a).toBe(1);
  });

  it("should throw an error if the format statement is present and is different of JSON ", async () => {
    await expect(() =>
      client.query<{ a: number }>("SELECT * FROM generateRandom('a UInt8') LIMIT 1 FORMAT TSV")
    ).rejects.toThrow(new YacInvalidQueryFormat());
  });

  it("should throw an error if the query is empty", async () => {
    await expect(() => client.query("Sel * ")).rejects.toThrow(new YacQuerySyntaxError());
  });

  describe("Inserting data", () => {
    const tableName = "test_table";
    beforeEach(async () => {
      await client.execute(`CREATE TABLE IF NOT EXISTS ${tableName} (a UInt8) ENGINE = Memory`);
    });

    afterEach(async () => {
      await client.execute(`DROP TABLE IF EXISTS ${tableName}`);
    });

    it("should insert data", async () => {
      const data = [{ a: 1 }, { a: 2 }];
      await client.insert(tableName, data);
      const result = await client.query<typeof data[0]>(`SELECT * FROM ${tableName}`);

      expect(result).toHaveLength(2);
      expect(result[0].a).toBe(1);
    });
  });

  describe("Executing queries", () => {
    it("should execute a query", async () => {
      const [result] = await client.query<{ number: number }>("SELECT 1 as number");
      expect(result.number).toBe(1);
    });

    it("should return a number even being a big integer", async () => {
      const [result] = await client.query<{ count: number }>(
        "SELECT COUNT(*) AS count FROM (SELECT * FROM numbers(500))"
      );
      expect(result.count).toBe(500);
    });
  });
});
