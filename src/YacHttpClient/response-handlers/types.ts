import { IncomingMessage } from "http";
import { YacHttpClientResponse } from "../types";

export type ResponseHandler<T> = (
  resolve: (value: YacHttpClientResponse<T> | PromiseLike<YacHttpClientResponse<T>>) => void,
  reject: (reason?: any) => void
) => (res: IncomingMessage) => void;
