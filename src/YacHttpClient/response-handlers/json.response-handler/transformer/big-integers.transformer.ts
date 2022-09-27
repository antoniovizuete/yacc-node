import { JsonResponse } from "../json.response-handler";

const BIG_INT_TYPES = ["Int64", "UInt64", "Int128", "UInt128", "Int256", "UInt256"];

const isBigInt = ({ type }: { type: string }) => BIG_INT_TYPES.includes(type);

export function bigIntegersTransformer<T extends Record<string, unknown>>(
  response: JsonResponse<T>
): JsonResponse<T> {
  const bigIntColumns = response.meta.filter(isBigInt).map(({ name }) => name);
  for (const row of response.data) {
    for (const column of bigIntColumns) {
      row[column as keyof T] = +(row[column] as string) as T[keyof T];
    }
  }

  return response;
}
