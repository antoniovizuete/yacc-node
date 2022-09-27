import { JsonResponse } from "../json.response-handler";
import { bigIntegersTransformer } from "./big-integers.transformer";

export function transform<T extends Record<string, unknown>>(
  response: JsonResponse<T>
): JsonResponse<T> {
  return bigIntegersTransformer(response);
}
