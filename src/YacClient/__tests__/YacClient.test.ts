import { YacInvalidQueryFormat } from "../../errors/YacInvalidQueryFormat";
import { YacQuerySyntaxError } from "../../errors/YacQuerySyntaxError";
import { YacClient } from "../YacClient";

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
      client.query<{ a: number }>(`SELECT * FROM generateRandom('a UInt8') LIMIT 1 FORMAT TSV`)
    ).rejects.toThrow(new YacInvalidQueryFormat());
  });

  it("should throw an error if the query is empty", async () => {
    await expect(() => client.query("Sel * ")).rejects.toThrow(new YacQuerySyntaxError());
  });

  it("should create a table, insert data and retrieve it", async () => {
    const tableName = "test_table";
    await client.execute(`CREATE TABLE IF NOT EXISTS ${tableName} (a UInt8) ENGINE = Memory`);
    await client.execute(`INSERT INTO ${tableName} VALUES (1)`);
    const result = await client.query<{ a: number }>(`SELECT * FROM ${tableName}`);
    await client.execute(`DROP TABLE ${tableName}`);
    expect(result).toHaveLength(1);
    expect(result[0].a).toBe(1);
  });
});
