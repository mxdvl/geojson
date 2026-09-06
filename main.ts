/** Coordinates with either 2 or 3 dimensions, as per [§3.1.1](https://www.rfc-editor.org/info/rfc7946/#section-3.1.1) */
export type Position =
  | readonly [longitude: number, latitude: number]
  | readonly [longitude: number, latitude: number, altitude: number];
