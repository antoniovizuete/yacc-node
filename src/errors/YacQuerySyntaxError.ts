export class YacQuerySyntaxError extends Error {
  public readonly reason?: string;

  constructor(reason?: string) {
    super("Query syntax error");
    this.name = "YacQuerySyntaxError";
    this.reason = reason;
  }
}
