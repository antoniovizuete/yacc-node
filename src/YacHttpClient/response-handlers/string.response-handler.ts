import { YacQuerySyntaxError } from "../../errors/YacQuerySyntaxError";
import { HTTP_400, HTTP_500 } from "../constants";
import { ResponseHandler } from "./types";

export const stringResponseHandler: ResponseHandler<string> = (resolve, reject) => (response) => {
  const array: Uint8Array[] = [];
  response.on("data", (chunk) => array.push(chunk));
  response.on("end", () => {
    const status = response.statusCode ?? HTTP_500;
    const result = {
      status,
      payload: Buffer.concat(array).toString(),
      headers: response.headers as Record<string, string>,
    };

    if (status >= HTTP_400) {
      reject(new YacQuerySyntaxError(result.payload));
    } else {
      resolve(result);
    }
  });
  response.on("error", (error) => {
    reject(error);
  });
};
