import type { Position as _Position } from "geojson";
import type { Position } from "./main.ts";

const position = [123, 456] satisfies Position;

display(position);
display([1, 2, 3]);

function display([x, y, z]: Position) {
  return z === undefined ? `${x},${y}` : `${x},${y},${z}`;
}
