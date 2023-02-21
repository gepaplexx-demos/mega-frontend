export function booleanCompare(a: boolean, b: boolean) {
  // double negation (!!) is used to convert undefined/null to false, otherwise Number(undefined/null) would return NaN
  return Number(!!a) - Number(!!b);
}
export function stringCompare(a: string, b: string) {
  return a.localeCompare(b);
}
