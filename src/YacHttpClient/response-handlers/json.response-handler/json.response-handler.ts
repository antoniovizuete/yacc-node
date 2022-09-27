import { YacQuerySyntaxError } from "../../../errors/YacQuerySyntaxError";
import { HTTP_400, HTTP_500 } from "../../constants";
import { ResponseHandler } from "../types";
import { transform } from "./transformer";

export type JsonResponse<T extends Record<string, unknown>> = {
  data: T[];
  meta: {
    name: string;
    type: string;
  }[];
  rows: number;
  rows_before_limit_at_least: number;
  statitstics: {
    elapsed: number;
    rows_read: number;
    bytes_read: number;
  };
};

export function jsonResponseHandler<T extends Record<string, unknown>>(): ResponseHandler<
  JsonResponse<T>
> {
  return (resolve, reject) => (response) => {
    const array: Uint8Array[] = [];
    response.on("data", (chunk) => array.push(chunk));
    response.on("end", () => {
      const status = response.statusCode ?? HTTP_500;
      const rawPayload = Buffer.concat(array).toString();
      const headers = response.headers as Record<string, string>;

      if (status >= HTTP_400) {
        reject(new YacQuerySyntaxError(rawPayload));
        return;
      }

      try {
        const payload = JSON.parse(rawPayload) as JsonResponse<T>;
        transform(payload);
        resolve({ headers, status, payload });
      } catch (e) {
        reject(new YacQuerySyntaxError((e as Error).message));
      }
    });
    response.on("error", (error) => {
      reject(error);
    });
  };
}
