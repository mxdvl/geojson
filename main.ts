/** Either 2 or 3 dimensions, as per RFC */
export type Position =
  | readonly [number, number]
  | readonly [number, number, number];
