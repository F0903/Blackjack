// export function numEquals(a: number, b: number): boolean {
//   // I hate JS floating point numbers.
//   return a < b + Number.EPSILON && a > b - Number.EPSILON;
// }

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
