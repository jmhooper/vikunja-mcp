export interface FilterCondition {
  field: string;
  op: string;
  value: string | number | boolean;
}

export function buildFilter(conditions: FilterCondition[]): string {
  if (conditions.length === 0) return "";

  const expr = conditions
    .map(({ field, op, value }) => `${field} ${op} ${value}`)
    .join(" && ");

  return `?filter=${expr.replace(/ /g, "%20")}`;
}
